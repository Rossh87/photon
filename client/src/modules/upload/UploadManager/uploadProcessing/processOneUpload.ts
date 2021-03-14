import { requestUploadURIs } from './requestUploadURIs';
import { handleImageUpload } from './handleImageUpload';
import { makeAndAppendResizedImages } from './makeAndAppendResizedImages';
import {
	IAsyncUploadDependencies,
	IUploadsResponsePayload,
} from './uploadProcessingTypes';
import { UploadError } from './UploadError';
import { IPreprocessedFile } from '../uploadPreprocessing/uploadPreprocessingTypes';
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as T from 'fp-ts/lib/Task';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import * as TE from 'fp-ts/lib/TaskEither';
import * as R from 'fp-ts/lib/Reader';
import * as RT from 'fp-ts/lib/ReaderTask';

export const processOneUpload = (file: IPreprocessedFile) =>
	pipe(
		RT.of(file),
		RT.chain(makeAndAppendResizedImages),
		RT.bindTo('resizeData'),
		RT.bind('uris', (x) => requestUploadURIs(x.resizeData)),
		RT.chain((x) =>
			pipe(
				RT.of(x.uris),
				RTE.chain((u) => handleImageUpload(x.resizeData)(u))
			)
		),
		RT.chain((x) =>
			R.asks((deps) =>
				T.of(
					pipe(
						x,
						E.map((r) =>
							deps.dispatch({
								type: 'UPLOAD_SUCCESS',
								data: file.displayName,
							})
						),
						E.mapLeft((e) =>
							deps.dispatch({ type: 'UPLOAD_FAILED', data: e })
						)
					)
				)
			)
		)
	);
