import { pipe } from 'fp-ts/lib/function';
import { fromArray } from 'fp-ts/lib/NonEmptyArray';
import { TSelectedFilesState } from '../uploadStateTypes';
import { map as OMap, getOrElseW } from 'fp-ts/Option';
import { TPreprocessingResults } from '../../domain/domainTypes';

const flagErrOrNonUnique = (a: TPreprocessingResults) =>
    a.some((x) => x.error !== undefined || x.isUniqueDisplayName === 'no');

export const canProcess = (selectedFiles: TSelectedFilesState): boolean =>
    pipe(
        selectedFiles,
        fromArray,
        OMap(flagErrOrNonUnique),
        getOrElseW(() => false)
    );
