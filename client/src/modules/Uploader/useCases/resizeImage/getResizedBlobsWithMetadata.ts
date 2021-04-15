import { resizeCanvasToTargetWidth } from './resizeCanvasToTargetWidth';
import { canvasToBlob } from './canvasToBlob';
import { calculateBlobMD5Hash } from './calculateBlobMD5Hash';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import {
	NonEmptyArray,
	map as NEAMap,
	sequence,
} from 'fp-ts/lib/NonEmptyArray';
import { IMAGE_UPLOAD_QUALITY } from '../../../../CONSTANTS';
import { IUploadRequestMetadata } from '../../http/httpTypes';
import { ImageReducerError } from '../../domain/ImageReducerError';
import { IUploadableBlob } from '../../domain/domainTypes';

type TWrapperData = Pick<
	IUploadRequestMetadata,
	'ownerID' | 'displayName' | 'mediaType'
>;

export const getResizedBlobsWithMetadata = (wrapperData: TWrapperData) => (
	canvas: HTMLCanvasElement
) => (
	widths: NonEmptyArray<number>
): TE.TaskEither<ImageReducerError, NonEmptyArray<IUploadableBlob>> =>
	pipe(
		widths,
		NEAMap((width) =>
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
		sequence(TE.taskEither)
	);
