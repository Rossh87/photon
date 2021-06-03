import { tryCatch, map as TEMap } from 'fp-ts/lib/TaskEither';
import { left, right, chain as EChain } from 'fp-ts/lib/Either';
import { map as TMap } from 'fp-ts/lib/Task';
import { flow } from 'fp-ts/lib/function';
import { IImage } from '../../domain/domainTypes';
import { ImageReducerError } from '../../domain/ImageReducerError';

const loadImg = (f: IImage) =>
	tryCatch(
		() => loadDataURL(f).then(populateImg),
		(e) =>
			ImageReducerError.create(
				f,
				e,
				'failed to convert original file blob to HTMLImageElement'
			)
	);

const loadDataURL = (f: IImage) =>
	new Promise<string>((res, rej) => {
		const reader = new FileReader();

		reader.addEventListener('load', (e) =>
			e.target?.result
				? res(e.target.result as string)
				: rej(
						'conversion from file to payloadURL failed--expected result to be truthy, but received null'
				  )
		);

		reader.readAsDataURL(f);
	});

const populateImg = (url: string) => {
	const img = document.createElement('img');
	img.src = url;
	return img;
};

const generateCanvas = (img: HTMLImageElement) => {
	try {
		const canvas = document.createElement('canvas');
		const { width, height } = img;

		canvas.width = width;
		canvas.height = height;

		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		return right(canvas);
	} catch (e) {
		return left(
			ImageReducerError.create(
				img,
				e,
				'conversion of original image from image element to canvas element failed'
			)
		);
	}
};

// Need to settle on a type for this to return...
export const fileToCanvas = flow(loadImg, TMap(EChain(generateCanvas)));
