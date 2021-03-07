import { IUploadRequestMetadata } from '../sharedUploadTypes';

export const mockUploadRequestObject: IUploadRequestMetadata = {
	ownerID: '1234',
	sizeInBytes: 200240,
	displayName: 'someUser/somePath.jpg',
	integrityHash: 'adbcdefgh',
	primaryColor: 'red',
	mediaType: 'image/jpeg',
};
