import { requestUploadURIs } from './requestUploadURIs';
import { saveSuccessfulUpload } from './saveSuccessfulUpload';
import { dispatchSuccesses } from './dispatchSuccesses';
import { uploadToGCS } from './uploadToGCS';
import { IDependencies } from '../../../../core/sharedTypes';
import { IPreprocessedFile } from '../../../../core/imageReducer/preprocessImages/imagePreprocessingTypes';
import { pipe, flow } from 'fp-ts/lib/function';
import { doResize } from './doResize';
import {
	chain as RTEChain,
	bindTo as RTEBindTo,
	bind as RTEBind,
	map as RTEMap,
	mapLeft as RTEMapLeft,
	fold as RTEFold,
	asks as RTEAsks,
} from 'fp-ts/lib/ReaderTaskEither';
import { asks as RAsks, chain as RChain } from 'fp-ts/lib/Reader';
import {
	fold as TEFold,
	map as TEMap,
	mapLeft as TEMapLeft,
} from 'fp-ts/lib/TaskEither';
import { chain as RTChain, asks as RTAsks } from 'fp-ts/lib/ReaderTask';
import {
	fold as EFold,
	map as EMap,
	mapLeft as EMapLeft,
} from 'fp-ts/lib/Either';

import { dispatchFailure } from './dispatchFailure';

export const processOneImage = (file: IPreprocessedFile) =>
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
