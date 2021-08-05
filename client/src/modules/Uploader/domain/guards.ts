import { IImage, TPreprocessingResult } from './domainTypes';
import { pipe } from 'fp-ts/function';
import { fromNullable, fold as OFold } from 'fp-ts/lib/Option';

export function isIImage(a: TPreprocessingResult): a is IImage {
    return pipe(
        a.error,
        fromNullable,
        OFold(
            () => true,
            (_) => false
        )
    );
}
