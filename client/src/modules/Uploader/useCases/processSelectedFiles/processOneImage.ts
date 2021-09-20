import { pipe, flow } from 'fp-ts/lib/function';
import { IImage, TPreprocessingResult } from '../../domain/domainTypes';
import { isIImage } from '../../domain/guards';
import { requestUploadURIs } from '../../http/requestUploadURIs';
import { saveSuccessfulUpload } from '../../http/saveSuccessfulUpload';
import { uploadToGCS } from './uploadToGCS';
import {
	bind as RTEBind,
	bindTo as RTEBindTo,
	chain as RTEChain,
	chainFirst as RTEChainFirst,
	orElseFirstW,
	asks,
	map as RTEMap,
} from 'fp-ts/lib/ReaderTaskEither';
import { doResize } from './doResize';
import { foldImageDataForRecall } from './foldImageDataForRecall';
import { dispatchInitUpload } from './dispatchInitUpload';
import {
	chain as RChain,
	chainFirst as RChainFirst,
	of as ROf,
} from 'fp-ts/lib/Reader';
import { fromPredicate } from 'fp-ts/lib/Option';
import { getOrElseW } from 'fp-ts/lib/Option';

const fromBoundContext =
	<T extends Record<string, any>, K extends string>(x: K) =>
	(y: T) =>
		y[x];

// Application should break if images with errors are ever submitted for processing!
// Calling code is meant to ensure this.
const ensureNoErrs = flow(
	fromPredicate<TPreprocessingResult, IImage>(isIImage),
	getOrElseW(() => {
		throw new Error(
			'Panic! Image files with outstanding errors should never be submitted for processing!'
		);
	})
);

export const processOneImage = (file: TPreprocessingResult) =>
	pipe(
		file,
		ensureNoErrs,
		ROf,
		RChainFirst(dispatchInitUpload),
		RChain(doResize),
		RTEBindTo('resizeData'),
		RTEBind(
			'uris',
			flow(fromBoundContext('resizeData'), requestUploadURIs)
		),
		RTEChainFirst((x) => uploadToGCS(x.resizeData)(x.uris)),
		RTEChainFirst(
			flow(
				fromBoundContext('resizeData'),
				foldImageDataForRecall,
				saveSuccessfulUpload
			)
		),
		RTEChainFirst(() =>
			asks((d) =>
				d.dispatch({
					type: 'UPLOADER/UPLOAD_SUCCESS',
					payload: file.displayName,
				})
			)
		),
		// return the combined image metadata on success so that we can update UI
		// without querying server
		RTEMap(flow(fromBoundContext('resizeData'), foldImageDataForRecall)),
		orElseFirstW((e) =>
			asks((deps) =>
				deps.dispatch({
					type: 'UPLOADER/UPLOAD_FAILED',
					payload: {
						err: e,
						failedFileDisplayName: file.displayName,
					},
				})
			)
		)
	);
