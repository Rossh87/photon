// Adapted from https://dev.to/taylorbeeston/resizing-images-client-side-with-vanilla-js-4ng2
// Thanks buddy.
import { IPreprocessedFile, TSizeSelectionResult } from '../uploadTypes';
import { UPLOAD_WIDTHS, UPLOAD_WIDTH_VALUES } from '../../../../CONSTANTS';
import { flow } from 'fp-ts/lib/function';
import { map, chain, Task } from 'fp-ts/lib/Task';

// Tail-call optimized... Fun!
export const generateResizedImages = (
	sizeSelectionResult: TSizeSelectionResult
): Task<Array<HTMLCanvasElement>> => async () => {
	const [sizeIdx, originalCanvas] = sizeSelectionResult;

	const resizeRunner = async (
		canvas: HTMLCanvasElement,
		res: Array<HTMLCanvasElement>,
		idx: number
	): Promise<Array<HTMLCanvasElement>> => {
		if (idx < 0) return res;

		const targetWidth = UPLOAD_WIDTH_VALUES[sizeIdx];

		const resizedImg = await resizeOneCanvas(canvas, targetWidth);

		// base next downscaling off most recent resize to minimize total number
		// of calls to resizing functions.
		return resizeRunner(resizedImg, [resizedImg, ...res], idx - 1);
	};

	return await resizeRunner(originalCanvas, [], sizeIdx);
};

export const resizeOneCanvas = async (
	canvas: HTMLCanvasElement,
	targetWidth: number
) => {
	while (canvas.width >= 2 * targetWidth) {
		canvas = scaleCanvas(canvas, 0.5);
	}

	if (canvas.width > targetWidth) {
		canvas = scaleCanvas(canvas, targetWidth / canvas.width);
	}

	return canvas;
};

// Get a new canvas resized to appropriate scale
const scaleCanvas = (canvas: HTMLCanvasElement, scale: number) => {
	const scaledCanvas = document.createElement('canvas');
	scaledCanvas.width = canvas.width * scale;
	scaledCanvas.height = canvas.height * scale;

	// it's impossible for getContext to return null here, so we cast
	// that possibility away
	const ctx = scaledCanvas.getContext('2d') as CanvasRenderingContext2D;
	ctx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

	return scaledCanvas;
};

const fileToCanvas = (
	f: IPreprocessedFile
): Task<HTMLCanvasElement> => async () => {
	const canvas = document.createElement('canvas');
	const img = document.createElement('img');

	// create img element from File object
	img.src = await new Promise((resolve) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			const target = e.target as FileReader;
			resolve(target.result as string);
		};
		reader.readAsDataURL(f);
	});

	await new Promise((resolve) => {
		img.onload = resolve;
	});

	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

	return canvas;
};

// return first size down from original size, or the max position--whichever is smaller
const calcMaxNeededSize = (canvas: HTMLCanvasElement): TSizeSelectionResult => {
	const { width } = canvas;
	let maxSizePosition = 0;
	while (
		UPLOAD_WIDTH_VALUES[maxSizePosition] < width &&
		maxSizePosition < UPLOAD_WIDTHS.length
	) {
		maxSizePosition++;
	}

	return [maxSizePosition, canvas];
};

TODO: export const getResizedImages = flow(
	fileToCanvas,
	map(calcMaxNeededSize),
	chain(generateResizedImages)
);
