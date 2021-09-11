import { none } from 'fp-ts/lib/Option';
import { IClientUpload } from '../../../../../sharedTypes/Upload';
import { IConfigurableImage } from '../state/imageConfigurationStateTypes';

export const clientUploadToConfigurable = (
	upload: IClientUpload
): IConfigurableImage => ({
	...upload,
	isSynchronizedWithBackend: true,
	error: none,
	requestPending: false,
	hasUpdated: false,
	open: true,
});
