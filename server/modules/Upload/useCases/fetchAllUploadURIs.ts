import { _processUploadInitSuccess } from '../helpers/processUploadInitSuccess';
import {
	_requestResumableUpload,
	requestResumableUpload,
} from '../helpers/requestResumableUpload';
import { IUploadRequestMetadata } from 'sharedTypes/Upload';
import {
	map as NEAMap,
	sequence as NEASequence,
} from 'fp-ts/lib/NonEmptyArray';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import * as RT from 'fp-ts/lib/ReaderTask';
import { pipe, flow } from 'fp-ts/lib/function';
import { toResponsePayload } from '../helpers/toResponsePayload';

export const handleOneUpload = (uploadRequest: IUploadRequestMetadata) => {
	return pipe(
		uploadRequest,
		requestResumableUpload,
		RTE.map(_processUploadInitSuccess(uploadRequest))
	);
};
// sequence array of readers to be able to run them all as a single reader
const sequenceReaderTasks = NEASequence(RT.readerTask);

export const fetchAllUploadURIs = flow(
	NEAMap(handleOneUpload),
	sequenceReaderTasks,
	RT.map(toResponsePayload)
);
