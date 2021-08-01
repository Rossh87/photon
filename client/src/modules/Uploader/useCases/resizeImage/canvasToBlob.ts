import { tryCatch } from 'fp-ts/lib/TaskEither';
import { ImageReducerError } from '../../domain/ImageReducerError';

export const canvasToBlob = (quality: number) => (type: string) => (
	c: HTMLCanvasElement
) =>
	tryCatch(
		() => toBlob(c, type, quality),
		(e) => ImageReducerError.create(c, e, 'See raw')
	);

const toBlob = (c: HTMLCanvasElement, type: string, quality: number) =>
	new Promise<Blob>((res, rej) =>
		c.toBlob(
			(b) =>
				b
					? res(b)
					: rej(
							'Attempt to convert canvas to blob failed--expected blob to be truthy, but received null'
					  ),
			type,
			quality
		)
	);
