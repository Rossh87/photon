import {
    TPreprocessArgs,
    TNonEmptyPreprocessArgs,
    IImageWithErrors,
    IImage,
} from '../../domain/domainTypes';
import { map as OMap, fold as OFold } from 'fp-ts/lib/Option';
import { pipe, flow } from 'fp-ts/lib/function';
import { fromArray, map as NEAMap } from 'fp-ts/lib/NonEmptyArray';
import { TUploaderActions } from '../../state/uploadStateTypes';
import { IO } from 'fp-ts/lib/IO';
import { IDependencies } from '../../../../core/dependencyContext';
import { appendMetadataToFile } from './appendMetadata';
import { validateFileSize } from './validateFileSize';
import { flagDuplicates } from './flagDuplicates';
import { chain as RTEChain, map as RTEMap, asks } from 'fp-ts/ReaderTaskEither';
import { chain as RChain } from 'fp-ts/Reader';
import { map as TEMap } from 'fp-ts/TaskEither';
import { fold as EFold } from 'fp-ts/Either';

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
    RTEChain((f) =>
        asks((deps) =>
            deps.dispatch({
                type: 'FILES_SELECTED',
                payload: f,
            })
        )
    )
);
