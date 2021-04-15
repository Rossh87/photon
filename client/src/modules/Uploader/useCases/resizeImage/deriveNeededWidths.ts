import { IResizingData } from './imageReducerTypes';
import { ImageReducerError } from '../../domain/ImageReducerError';
import { UPLOAD_WIDTH_VALUES, UPLOAD_WIDTHS } from '../../../../CONSTANTS';
import { left, right, Either } from 'fp-ts/lib/Either';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';

export const deriveNeededWidths = (
	canvasOfOriginal: HTMLCanvasElement
): Either<ImageReducerError, NonEmptyArray<number>> => {
	const originalWidth = canvasOfOriginal.width;

	if (originalWidth < UPLOAD_WIDTH_VALUES[0]) {
		return left(
			ImageReducerError.create(
				canvasOfOriginal,
				null,
				`Submitted image is smaller than minimum width of ${UPLOAD_WIDTH_VALUES[0]}`
			)
		);
	}

	let maxSizePosition = 0;
	while (
		UPLOAD_WIDTH_VALUES[maxSizePosition] < originalWidth &&
		maxSizePosition < UPLOAD_WIDTHS.length
	) {
		maxSizePosition++;
	}

	const originalExceedsMaxWidth = maxSizePosition >= UPLOAD_WIDTHS.length;

	return originalExceedsMaxWidth
		? right(UPLOAD_WIDTH_VALUES.slice() as NonEmptyArray<number>)
		: right(
				UPLOAD_WIDTH_VALUES.slice(0, maxSizePosition).concat([
					originalWidth,
				]) as NonEmptyArray<number>
		  );
};
