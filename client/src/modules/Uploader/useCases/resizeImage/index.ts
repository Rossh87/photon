/**Significant pieces of this adapted from https://dev.to/taylorbeeston/resizing-images-client-side-with-vanilla-js-4ng2
Thanks buddy. 

We've extracted this into it's own folder and inject it into our business
functions as a dependency for ease of testing the business functions--some of the below won't work
in JSDOM.
**/
import { getResizedBlobsWithMetadata } from './getResizedBlobsWithMetadata';
import { deriveNeededWidths } from './deriveNeededWidths';
import { fileToCanvas } from './fileToCanvas';
import { pipe } from 'fp-ts/lib/function';
import { of, map, bind, bindTo, TaskEither } from 'fp-ts/lib/TaskEither';
import { of as TOf } from 'fp-ts/lib/Task';
import { ImageReducerError } from '../../domain/ImageReducerError';
import { IResizingData, IImage } from '../../domain/domainTypes';
import { TMediaType } from 'sharedTypes/Upload';

export const resizeImage = (
	f: IImage
): TaskEither<ImageReducerError, IResizingData> =>
	pipe(
		of<ImageReducerError, IImage>(f),
		bindTo('preprocessedFile'),
		bind('originalCanvas', (x) => fileToCanvas(x.preprocessedFile)),
		bind('neededWidths', (x) => TOf(deriveNeededWidths(x.originalCanvas))),
		bind('resizedBlobs', (x) =>
			getResizedBlobsWithMetadata({
				ownerID: x.preprocessedFile.ownerID,
				displayName: x.preprocessedFile.displayName,
				mediaType: x.preprocessedFile.type as TMediaType,
			})(x.originalCanvas)(x.neededWidths)
		),
		map((x) =>
			Object.assign(x.preprocessedFile, {
				originalCanvas: x.originalCanvas,
				neededWidths: x.neededWidths,
				resizedBlobs: x.resizedBlobs,
			})
		)
	);
