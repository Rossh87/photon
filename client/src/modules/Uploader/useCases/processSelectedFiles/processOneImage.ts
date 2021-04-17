import { pipe, flow } from 'fp-ts/lib/function';
import { IImage } from '../../domain/domainTypes';
import { requestUploadURIs } from '../../http/requestUploadURIs';
import { saveSuccessfulUpload } from '../../http/saveSuccessfulUpload';
import { uploadToGCS } from './uploadToGCS';
import {
	bind as RTEBind,
	bindTo as RTEBindTo,
	fold as RTEFold,
	chain as RTEChain,
	chainFirst as RTEChainFirst,
} from 'fp-ts/lib/ReaderTaskEither';
import { doResize } from './doResize';
import { foldImageDataForRecall } from './foldImageDataForRecall';
import { dispatchUploadSuccesses } from './dispatchUploadSuccesses';
import { dispatchUploadFailure } from './dispatchUploadFailure';

const fromBoundContext = <T extends Record<string, any>, K extends string>(
	x: K
) => (y: T) => y[x];

export const processOneImage = (file: IImage) =>
	pipe(
		file,
		doResize,
		RTEBindTo('resizeData'),
		RTEBind(
			'uris',
			flow(fromBoundContext('resizeData'), requestUploadURIs)
		),
		RTEChainFirst((x) => uploadToGCS(x.resizeData)(x.uris)),
		RTEChain(
			flow(
				fromBoundContext('resizeData'),
				foldImageDataForRecall,
				saveSuccessfulUpload
			)
		),
		RTEFold(
			(e) =>
				dispatchUploadFailure({
					err: e,
					failedFileDisplayName: file.displayName,
				}),
			() => dispatchUploadSuccesses(file.displayName)
		)
	);
