import { IAppState } from '../../modules/appState/appStateTypes';
import mockAppMeta from './mockAppMeta';
import mockImageState from './mockImages';
import mockUploader from './mockUploader';
import mockUser from './mockUser';
import mockConfigState from './mockImageUnderConfiguration';

const mockAppState: IAppState = {
	user: mockUser,
	images: mockImageState,
	appMeta: mockAppMeta,
	uploader: mockUploader,
	imageUnderConfiguration: mockConfigState,
};

export const getMockAppState = () => ({ ...mockAppState });

export default mockAppState;
