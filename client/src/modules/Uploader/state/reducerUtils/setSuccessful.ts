import { map as NEAMap } from 'fp-ts/lib/NonEmptyArray';
import { flow } from 'fp-ts/lib/function';
import { TPreprocessingResult } from '../../domain/domainTypes';

export const setSuccessful = (successfulUpload: string) =>
    flow(
        NEAMap<TPreprocessingResult, TPreprocessingResult>((f) =>
            f.displayName === successfulUpload
                ? Object.assign(f, { status: 'success' })
                : f
        )
    );
