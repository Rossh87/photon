import { IImage, TPreprocessingResult } from './domainTypes';
import { pipe } from 'fp-ts/function';
import { fold as OFold, fromNullable } from 'fp-ts/lib/Option';

export function isIImage(a: TPreprocessingResult): a is IImage {
	return pipe(
		a.error,
		fromNullable,
		OFold(
			() => true,
			() => false
		)
	);
}
