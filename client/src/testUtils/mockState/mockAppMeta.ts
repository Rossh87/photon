import { TAppMetaState } from '../../modules/appMeta/appMetaTypes';

const mockAppMeta: TAppMetaState = {
	appMessage: null,
	demoMessageViewed: false,
};

export const getMockAppMeta = () => ({ ...mockAppMeta });

export default mockAppMeta;
