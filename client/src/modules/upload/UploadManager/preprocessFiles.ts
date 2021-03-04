import { IUploadReaderDependencies, IProcessedFile } from './uploadTypes';
import { collatePreprocessResults } from './preprocessFilesConstructs';
import {
    Either,
    map as Emap,
    fromOption,
    right,
    left,
    fold as Efold,
} from 'fp-ts/lib/Either';
import { pipe, flow } from 'fp-ts/lib/function';
import {
    MAX_RAW_FILE_SIZE_IN_BYTES,
    BASE_IMAGE_UPLOAD_PATH,
    UPLOAD_WIDTHS,
} from '../../../CONSTANTS';
import {
    NonEmptyArray,
    map as NEAmap,
    fromArray,
} from 'fp-ts/lib/NonEmptyArray';
import { UploadError } from './UploadError';

export const bytesToHumanReadableSize = (byteCount: number): string =>
    byteCount < 1024
        ? byteCount + 'bytes'
        : byteCount >= 1024 && byteCount < 1048576
        ? (byteCount / 1024).toFixed(1) + 'KB'
        : (byteCount / 1048576).toFixed(1) + 'MB';

export const generateFileSizeErr = (file: IProcessedFile): UploadError => {
    const message = `file ${file.name} exceeds maximum initial image size of ${
        MAX_RAW_FILE_SIZE_IN_BYTES / 1000 / 1000
    }MB`;

    return UploadError.create(message, file);
};

const validateFileSize = (
    file: IProcessedFile
): Either<UploadError, IProcessedFile> =>
    file.size <= MAX_RAW_FILE_SIZE_IN_BYTES
        ? right(file)
        : left(generateFileSizeErr(file));

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

const appendMetadataToFile = (deps: IUploadReaderDependencies) => (
    file: File
) =>
    Object.assign(file, {
        ownerID: deps.ownerID,
        uploadPaths: generateUploadPaths(file.name, deps.ownerID),
        humanReadableSize: bytesToHumanReadableSize(file.size),
    });

// We return a strange type here to make this result compatible with collation
// function
export const generateEmptyFileListErr = (): NonEmptyArray<
    Either<UploadError, never>
> => [left(UploadError.create('at least one file must be selected'))];

export const fileListToNonEmptyArray = (
    f: FileList
): Either<NonEmptyArray<Either<UploadError, never>>, NonEmptyArray<File>> =>
    pipe(
        Array.from(f),
        fromArray,
        fromOption(() => generateEmptyFileListErr())
    );

export const processAndValidateFiles = (deps: IUploadReaderDependencies) =>
    pipe(flow(appendMetadataToFile(deps), validateFileSize), NEAmap);

export const preprocessFiles = (deps: IUploadReaderDependencies) =>
    flow(
        fileListToNonEmptyArray,
        // if array is empty we'll have a result to collate at this point, so go ahead
        // and fold our Either type.
        Efold(collatePreprocessResults, (files) =>
            pipe(files, processAndValidateFiles(deps), collatePreprocessResults)
        )
    );
