import { resizeCanvasToTargetWidth } from './resizeCanvasToTargetWidth';
import { canvasToBlob } from './canvasToBlob';
import { calculateBlobMD5Hash } from './calculateBlobMD5Hash';
import { pipe, flow } from 'fp-ts/lib/function';
import { map } from 'fp-ts/lib/ReadonlyArray';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { IMAGE_UPLOAD_QUALITY } from '../../CONSTANTS';
import { IUploadRequestMetadata } from './imageReducerTypes';
import { ImageReducerError } from './ImageReducerError';
import { IUploadableBlob } from '../../modules/upload/UploadManager/uploadProcessing/uploadProcessingTypes';

type TWrapperData = Pick<
	IUploadRequestMetadata,
	'ownerID' | 'displayName' | 'mediaType'
>;

// Where the magic happens bb.
export const getResizedBlobsWithMetadata = (wrapperData: TWrapperData) => (
	canvas: HTMLCanvasElement
) => (
	widths: Array<number>
): TE.TaskEither<ImageReducerError, ReadonlyArray<IUploadableBlob>> =>
	pipe(
		widths,
		map((width) =>
			pipe(
				TE.of<ImageReducerError, HTMLCanvasElement>(
					resizeCanvasToTargetWidth(canvas)(width)
				),
				TE.bindTo('originalCanvas'),
				TE.bind('blob', (x) =>
					canvasToBlob(IMAGE_UPLOAD_QUALITY)(wrapperData.mediaType)(
						x.originalCanvas
					)
				),
				TE.bind('integrityHash', (x) => calculateBlobMD5Hash(x.blob)),
				TE.map((x) =>
					Object.assign(
						{},
						{
							blob: x.blob,
							metaData: {
								...wrapperData,
								integrityHash: x.integrityHash,
								sizeInBytes: x.blob.size,
								width: x.originalCanvas.width,
							},
						}
					)
				)
			)
		),
		TE.sequenceArray
	);
