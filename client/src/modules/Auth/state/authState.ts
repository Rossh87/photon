import { Reducer } from 'react';
import { TAuthorizedUserResponse } from 'sharedTypes/User';
import { IDeleteImageAction } from '../../ImageSearch/state/imageSearchStateTypes';
import { IUploadSuccessAction } from '../../Uploader/state/uploadStateTypes';
import { TAuthActions, TUserState } from './authStateTypes';

export const defaultState: TUserState = null;

export const authReducer: Reducer<
	TUserState,
	| TAuthActions
	| IUploadSuccessAction
	| IDeleteImageAction
	| { type: 'AUTH/TEST_ACTION' }
> = (state, action) => {
	switch (action.type) {
		case 'AUTH/TEST_ACTION':
			return { ...(state as TAuthorizedUserResponse), imageCount: 10000 };
		case 'AUTH/ADD_UPLOAD_DATA':
			return {
				...(state as TAuthorizedUserResponse),
				imageCount:
					(state as TAuthorizedUserResponse).imageCount +
					action.payload.fileCount,
				uploadUsage:
					(state as TAuthorizedUserResponse).uploadUsage +
					action.payload.combinedSize,
			};

		case 'IMAGES/DELETE_IMAGE':
			return {
				...(state as TAuthorizedUserResponse),
				imageCount: (state as TAuthorizedUserResponse).imageCount - 1,
			};

		case 'AUTH/ADD_USER':
			return {
				...action.payload,
			};

		case 'AUTH/LOGOUT_USER':
			return null;

		case 'AUTH/UPDATE_PROFILE_ACTION':
			return state
				? { ...state, userPreferences: { ...action.payload } }
				: state;
		default:
			return state;
	}
};
