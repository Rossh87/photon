import { _processUploadInitSuccess } from './processUploadInitSuccess';
import {
	_requestResumableUpload,
	requestResumableUpload,
	ResumableUploadCreationErr,
} from './requestResumableUpload';
import { IUploadRequestMetadata } from '../sharedUploadTypes';
import {
	map as NEAMap,
	sequence as NEASequence,
	getSemigroup,
} from 'fp-ts/lib/NonEmptyArray';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import * as RT from 'fp-ts/lib/ReaderTask';
import { pipe, flow } from 'fp-ts/lib/function';
import { collateUploadInitResults } from './collateUploadInitResults';

export const handleOneUpload = (uploadRequest: IUploadRequestMetadata) =>
	pipe(
		uploadRequest,
		requestResumableUpload,
		RTE.map(_processUploadInitSuccess(uploadRequest))
	);

// sequence array of readers to be able to run them all as a single reader
const runAllRequests = NEASequence(RT.readerTask);

export const fetchAllUploadURIs = flow(
	NEAMap(handleOneUpload),
	runAllRequests,
	RT.map(collateUploadInitResults)
);
