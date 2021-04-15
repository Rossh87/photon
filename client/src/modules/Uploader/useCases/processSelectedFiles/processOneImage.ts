import { requestUploadURIs } from './requestUploadURIs';
import { saveSuccessfulUpload } from './saveSuccessfulUpload';
import { dispatchSuccesses } from '../dispatchSuccesses';
import { dispatchFailure } from '../dispatchFailure';
import { uploadToGCS } from './uploadToGCS';
import { IImage } from '../../domain/domainTypes';
import { pipe } from 'fp-ts/lib/function';
import { doResize } from './doResize';
import {
	bindTo as RTEBindTo,
	bind as RTEBind,
} from 'fp-ts/lib/ReaderTaskEither';
import { chain as RTChain, asks as RTAsks } from 'fp-ts/lib/ReaderTask';
import { fold as EFold } from 'fp-ts/lib/Either';

export const processOneImage = (file: IImage) =>
	pipe(
		file,
		doResize,
		RTEBindTo('resizeData'),
		RTEBind('uris', (x) => requestUploadURIs(x.resizeData)),
		RTEBind('GCSResponses', (x) => uploadToGCS(x.resizeData)(x.uris)),
		RTEBind('appServerResponses', (x) =>
			saveSuccessfulUpload(x.resizeData)
		),
		RTChain((either) =>
			RTAsks((deps) =>
				pipe(
					either,
					EFold(
						(e) =>
							dispatchFailure({
								err: e,
								failedFileDisplayName: file.displayName,
							})(deps),
						() => dispatchSuccesses(file.displayName)(deps)
					)
				)
			)
		)
	);
