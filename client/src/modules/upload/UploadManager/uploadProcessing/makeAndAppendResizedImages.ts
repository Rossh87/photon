// Adapted from https://dev.to/taylorbeeston/resizing-images-client-side-with-vanilla-js-4ng2
// Thanks buddy.
import {
	IResizingMetadata,
	IBlobWithIntegrityHash,
	IAsyncUploadDependencies,
} from './uploadProcessingTypes';
import { IPreprocessedFile } from '../uploadPreprocessing/uploadPreprocessingTypes';
import {
	UPLOAD_WIDTHS,
	UPLOAD_WIDTH_VALUES,
	IMAGE_UPLOAD_QUALITY,
} from '../../../../CONSTANTS';
import { pipe } from 'fp-ts/lib/function';
import { map as Tmap, chain as TChain, Task } from 'fp-ts/lib/Task';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { MD5, enc } from 'crypto-js';
import {
	of as RTOf,
	map as RTMap,
	chain as RTChain,
} from 'fp-ts/lib/ReaderTask';
import { map as RMap } from 'fp-ts/lib/Reader';

// There is an opportunity to optimize this by calculating the needed sizes for all images,
// requesting upload URIs in *parallel*, and then resizing/uploading in sequence to avoid
// hogging a ton of client's memory.  Difference would likely be small, however.
export const appendResizedImageBlobs = (
	resizeMetadata: Omit<IResizingMetadata, 'resizedBlobs'>
): Task<IResizingMetadata> => async () => {
	const { maxNeededSizeIdx, originalCanvas } = resizeMetadata;

	// TODO: we could profile to see if running all resizes in parallel saves
	// more time/resources than running in sequence to avoid excessive canvas
	// element creation.
	const resizedBlobs = await resizeRunner(
		resizeMetadata,
		originalCanvas,
		[],
		maxNeededSizeIdx
	);

	return Object.assign(resizeMetadata, { resizedBlobs });
};

const resizeRunner = async (
	resizeMetadata: Omit<IResizingMetadata, 'resizedBlobs'>,
	previousCanvas: HTMLCanvasElement,
	res: [] | NonEmptyArray<IBlobWithIntegrityHash>,
	sizeIdx: number
): Promise<NonEmptyArray<IBlobWithIntegrityHash>> => {
	if (sizeIdx < 0) return res as NonEmptyArray<IBlobWithIntegrityHash>;

	const targetWidth = UPLOAD_WIDTH_VALUES[sizeIdx];
	const sizeParam = UPLOAD_WIDTHS[sizeIdx];

	const resizedImg = await resizeOneCanvas(previousCanvas, targetWidth);

	const blob = await getBlob(
		resizedImg,
		resizeMetadata.type,
		IMAGE_UPLOAD_QUALITY
	);

	const integrityHash = await getBlobMD5Hash(blob);
	console.log(integrityHash);
	const blobWithHash: IBlobWithIntegrityHash = {
		blob,
		integrityHash,
		sizeParam,
	};

	// base next downscaling off most recent resize to minimize total number
	// of calls to resizing functions.
	return resizeRunner(
		resizeMetadata,
		resizedImg,
		[blobWithHash, ...res],
		sizeIdx - 1
	);
};

// safe to assume blob won't be null, since uploader won't accept a file of size 0
const getBlob = (c: HTMLCanvasElement, type: string, quality: number) =>
	new Promise<Blob>((res) => c.toBlob((b) => res(b as Blob), type, quality));

const getBlobMD5Hash = async (b: Blob): Promise<string> => {
	return new Promise((res) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			res(enc.Base64.stringify(MD5(reader.result as string)));
		};
		reader.readAsBinaryString(b);
	});
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
): Task<
	Omit<IResizingMetadata, 'resizedBlobs' | 'maxNeededSizeIdx'>
> => async () => {
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

	return Object.assign(f, { originalCanvas: canvas });
};

// return first size down from original size, or the max position--whichever is smaller
const calcMaxNeededSize = (
	resizingMetadata: Omit<
		IResizingMetadata,
		'resizedBlobs' | 'maxNeededSizeIdx'
	>
): Omit<IResizingMetadata, 'resizedBlobs'> => {
	const { width } = resizingMetadata.originalCanvas;
	let maxSizePosition = 0;
	while (
		UPLOAD_WIDTH_VALUES[maxSizePosition] < width &&
		maxSizePosition < UPLOAD_WIDTHS.length
	) {
		maxSizePosition++;
	}

	return Object.assign(resizingMetadata, {
		maxNeededSizeIdx: maxSizePosition,
	});
};

// lift this to Reader for convenience in main function.
// TODO: We can easily dispatch these objects to a cache in this function,
// then check that cache before retrying uploads if any fail to avoid doing
// this heavy processing again if the network fails.
export const makeAndAppendResizedImages = (f: IPreprocessedFile) =>
	pipe(
		RTOf<IAsyncUploadDependencies, IPreprocessedFile>(f),
		RMap(TChain(fileToCanvas)),
		RTMap(calcMaxNeededSize),
		RMap(TChain(appendResizedImageBlobs))
	);
