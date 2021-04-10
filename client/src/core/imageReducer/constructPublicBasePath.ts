import { IUploadableBlob } from './resizeImage/imageReducerTypes';
import { BASE_PUBLIC_IMAGE_PATH } from '../../CONSTANTS';

export const constructPublicBasePath = (data: IUploadableBlob) =>
	`${BASE_PUBLIC_IMAGE_PATH}/${data.metaData.ownerID}/${data.metaData.displayName}`;
