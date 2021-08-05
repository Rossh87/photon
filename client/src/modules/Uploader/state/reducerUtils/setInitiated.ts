import { map as NEAMap } from 'fp-ts/lib/NonEmptyArray';
import { flow } from 'fp-ts/lib/function';
import { TPreprocessingResult } from '../../domain/domainTypes';

export const setInitiated = (initiatedUpload: string) =>
    flow(
        NEAMap<TPreprocessingResult, TPreprocessingResult>((f) =>
            f.displayName === initiatedUpload
                ? Object.assign(f, { status: 'processing' })
                : f
        )
    );
