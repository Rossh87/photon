import { requestUploadURIs } from './requestUploadURIs';
import { uploadToGCS } from './uploadToGCS';
import { IAsyncDependencies } from '../../../../core/sharedTypes';
import { IPreprocessedFile } from '../../../../core/imageReducer/preprocessImages/imagePreprocessingTypes';
import { pipe } from 'fp-ts/lib/function';
import { of as ROf } from 'fp-ts/lib/Reader';
import {
	chain as TEChain,
	bindTo as TEBindTo,
	bind as TEBind,
} from 'fp-ts/lib/TaskEither';

export const processOneImage = (file: IPreprocessedFile) => (
	deps: IAsyncDependencies
) =>
	pipe(
		file,
		(f) => deps.imageReducer(f),
		TEBindTo('resizeData'),
		TEBind('uris', (x) => requestUploadURIs(x.resizeData)(deps)),
		TEChain((x) => uploadToGCS(x.resizeData)(x.uris)(deps))
	);
