import { IUploadableBlob } from '../modules/Uploader/domain/domainTypes';
import basePublicImagePath from './basePublicImagePath';

export const constructPublicBasePath = (data: IUploadableBlob) =>
	`${basePublicImagePath}/${data.metaData.ownerID}/${encodeURIComponent(
		data.metaData.displayName
	)}`;
