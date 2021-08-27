import { ICombinedUploadRequestMetadata } from '../sharedUploadTypes';
import { IDBUpload, TWithoutID } from 'sharedTypes/Upload';

export const attachBreakpointsToMetadata = (
	data: ICombinedUploadRequestMetadata
): TWithoutID<IDBUpload> => Object.assign(data, { breakpoints: [] });
