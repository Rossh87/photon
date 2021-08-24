import { IUploadableBlob } from '../modules/Uploader/domain/domainTypes';
import { BASE_PUBLIC_IMAGE_PATH } from '../modules/Uploader/http/endpoints';

export const constructPublicBasePath = (data: IUploadableBlob) =>
	`${BASE_PUBLIC_IMAGE_PATH}/${data.metaData.ownerID}/${encodeURIComponent(
		data.metaData.displayName
	)}`;
