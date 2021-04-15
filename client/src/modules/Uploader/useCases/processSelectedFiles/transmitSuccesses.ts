import { requestUploadURIs } from './requestUploadURIs';
import { uploadToGCS } from './uploadToGCS';
import { IDependencies } from '../../../../core/dependencyContext';
import { IImage } from '../../domain/domainTypes';
import { pipe } from 'fp-ts/lib/function';
import {
	chain as TEChain,
	bindTo as TEBindTo,
	bind as TEBind,
} from 'fp-ts/lib/TaskEither';
import { TUploaderActions } from '../../state/uploadStateTypes';

export const processOneImage = (file: IImage) => (
	deps: IDependencies<TUploaderActions>
) =>
	pipe(
		file,
		(f) => deps.imageReducer(f),
		TEBindTo('resizeData'),
		TEBind('uris', (x) => requestUploadURIs(x.resizeData)(deps)),
		TEChain((x) => uploadToGCS(x.resizeData)(x.uris)(deps))
	);
