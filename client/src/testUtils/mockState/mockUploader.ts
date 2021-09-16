import { none } from 'fp-ts/lib/Option';
import {
	IImageUploadState,
} from '../../modules/Uploader/state/uploadStateTypes';

// TODO: we're not currently using this in uploader tests b/c I don't want to rework those tests...
const mockUploader: IImageUploadState = {
	status: 'success',
	selectedFiles: [],
	componentLevelError: none,
};

export default mockUploader;
