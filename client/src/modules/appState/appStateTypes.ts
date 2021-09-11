import { TAppMetaActions, TAppMetaState } from '../appMeta/appMetaTypes';
import { TAuthActions, TUserState } from '../Auth/state/authStateTypes';
import {
	IImageConfigurationState,
	TImageConfigurationActions,
} from '../ImageSearch/state/imageConfigurationStateTypes';
import {
	IImageSearchState,
	TImageSearchActions,
} from '../ImageSearch/state/imageSearchStateTypes';
import {
	IImageUploadState,
	TUploaderActions,
} from '../Uploader/state/uploadStateTypes';

export type TAppAction =
	| TAuthActions
	| TUploaderActions
	| TAppMetaActions
	| TImageConfigurationActions
	| TImageSearchActions;

export interface IAppState {
	user: TUserState;
	uploader: IImageUploadState;
	appMeta: TAppMetaState;
	images: IImageSearchState;
	imageUnderConfiguration: IImageConfigurationState;
}
