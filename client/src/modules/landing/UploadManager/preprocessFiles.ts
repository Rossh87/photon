import {
    IUploadReaderDependencies,
    TPreProcessResult,
    TFilesArray,
} from './uploadTypes';
import {
    Either,
    getValidation,
    map as Emap,
    fromOption,
    right,
    left,
    either,
} from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import {
    MAX_RAW_FILE_SIZE_IN_BYTES,
    BASE_IMAGE_UPLOAD_PATH,
    UPLOAD_WIDTHS,
} from '../../../CONSTANTS';
import {
    NonEmptyArray,
    getSemigroup,
    map as NEAmap,
    fromArray,
} from 'fp-ts/lib/NonEmptyArray';
import {
    map as Rmap,
    Reader,
    chain as Rchain,
    of as Rof,
    asks,
} from 'fp-ts/lib/Reader';
import { sequenceT } from 'fp-ts/lib/Apply';

export const bytesToHumanReadableSize = (byteCount: number): string =>
    byteCount < 1024
        ? byteCount + 'bytes'
        : byteCount >= 1024 && byteCount < 1048576
        ? (byteCount / 1024).toFixed(1) + 'KB'
        : (byteCount / 1048576).toFixed(1) + 'MB';

export const generateFileSizeErr = (
    fileName: string
): NonEmptyArray<string> => [
    `file ${fileName} exceeds maximum initial image size of ${
        MAX_RAW_FILE_SIZE_IN_BYTES / 1000 / 1000
    }MB`,
];

const validateFileSize = (file: File): Either<NonEmptyArray<string>, File> =>
    file.size <= MAX_RAW_FILE_SIZE_IN_BYTES
        ? right(file)
        : left(generateFileSizeErr(file.name));

const generateUploadPaths = (
    name: string,
    ownerID: string
): NonEmptyArray<string> =>
    pipe(
        UPLOAD_WIDTHS,
        NEAmap((sizeParam) => {
            return [BASE_IMAGE_UPLOAD_PATH, ownerID, name, sizeParam].join('/');
        })
    );

const appendMetadataToFiles = (deps: IUploadReaderDependencies) => (
    files: TFilesArray
) =>
    pipe(
        files,
        NEAmap((file) => {
            return Object.assign(file, {
                ownerID: deps.ownerID,
                uploadPaths: generateUploadPaths(file.name, deps.ownerID),
                humanReadableSize: bytesToHumanReadableSize(file.size),
            });
        })
    );

const validator = sequenceT(getValidation(getSemigroup<string>()));

export const checkFileSize = (deps: IUploadReaderDependencies) => (
    files: TFilesArray
): Either<NonEmptyArray<string>, NonEmptyArray<File>> =>
    pipe(
        files,
        NEAmap(validateFileSize),
        // @ts-ignore because of spread operator weirdness
        (mapped) => validator(...mapped),
        // if no errs, return a Right with the original files
        Emap(() => files)
    );

export const generateEmptyFileListErr = (): NonEmptyArray<string> => [
    'at least one file must be selected',
];

export const fileListToNonEmptyArray = (
    f: FileList
): Either<NonEmptyArray<string>, NonEmptyArray<File>> =>
    pipe(
        Array.from(f),
        fromArray,
        fromOption(() => generateEmptyFileListErr())
    );

export const preprocessFiles = (
    files: FileList
): Reader<IUploadReaderDependencies, TPreProcessResult> =>
    pipe(
        Rof<IUploadReaderDependencies, FileList>(files),
        Rmap(fileListToNonEmptyArray),
        Rchain((eitherFiles) =>
            asks((deps) => either.chain(eitherFiles, checkFileSize(deps)))
        ),
        Rchain((eitherFiles) =>
            asks((deps) => either.map(eitherFiles, appendMetadataToFiles(deps)))
        )
    );
