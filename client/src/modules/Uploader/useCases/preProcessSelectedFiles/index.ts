import {
    TPreprocessArgs,
    TNonEmptyPreprocessArgs,
    IImageWithErrors,
    IImage,
} from '../../domain/domainTypes';
import { pipe, flow } from 'fp-ts/lib/function';
import { map as NEAMap } from 'fp-ts/lib/NonEmptyArray';
import { appendMetadataToFile } from './appendMetadata';
import { validateFileSize } from './validateFileSize';
import { flagDuplicates } from './flagDuplicates';
import { map as RTEMap } from 'fp-ts/ReaderTaskEither';
import { chain as RTChain, asks as RTAsks } from 'fp-ts/ReaderTask';
import { fold as EFold, map as EMap, mapLeft as EMapLeft } from 'fp-ts/Either';

// Calling code ensures FileList isn't empty.  This function just converts
// FileList to a normal array and asserts that it's NonEmpty
const toArray = ([fileList, ownerID]: TPreprocessArgs) =>
    pipe(
        fileList,
        Array.from,
        (files) => [files, ownerID] as TNonEmptyPreprocessArgs
    );

const formatFiles = ([files, ownerID]: TNonEmptyPreprocessArgs) =>
    pipe(files, NEAMap(flow(appendMetadataToFile(ownerID), validateFileSize)));

// sort of hacky way to get file data out of Either wrapper before
// it goes to React reducer
const unwrapEither = EFold<IImageWithErrors, IImage, IImageWithErrors | IImage>(
    (e) => e,
    (r) => r
);

export const preprocessImages = flow(
    toArray,
    formatFiles,
    flagDuplicates,
    RTEMap(NEAMap(unwrapEither)),
    RTChain((f) =>
        RTAsks((deps) =>
            pipe(
                f,
                EMap((f) => {
                    deps.dispatch({
                        type: 'FILES_SELECTED',
                        payload: f,
                    });
                }),
                EMapLeft((e) => {
                    deps.dispatch({
                        type: 'UPLOAD_COMPONENT_ERR',
                        payload: e,
                    });
                })
            )
        )
    )
);
