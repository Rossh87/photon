import { FastfoodOutlined } from '@material-ui/icons';
import { pipe } from 'fp-ts/lib/function';
import { fromNullable, none, some, fold } from 'fp-ts/lib/Option';
import { makeNewUIBreakpoint } from '../helpers/makeNewUIBreakpoint';
import {
	IConfigurableImage,
	IImageConfigurationState,
	TImageConfigurationActions,
} from './imageConfigurationStateTypes';
import { IDeleteImageAction } from './imageSearchStateTypes';

export const defaultState: IImageConfigurationState = {
	addedOn: '',
	_id: '',
	ownerID: '',
	breakpoints: [],
	isSynchronizedWithBackend: false,
	error: none,
	requestPending: false,
	hasUpdated: false,
	open: false,
	displayName: '',
	mediaType: 'image/jpeg',
	sizeInBytes: 0,
	integrityHash: [''],
	primaryColor: 'blue',
	availableWidths: [0],
	publicPathPrefix: '',
};

export const imageConfigurationReducer: React.Reducer<
	IImageConfigurationState,
	TImageConfigurationActions | IDeleteImageAction
> = (s, a) => {
	return pipe(
		s,
		fromNullable,
		fold(
			() => s,
			(s) => {
				switch (a.type) {
					case 'IMAGES/DELETE_IMAGE':
						return defaultState;

					case 'IMAGE_CONFIG/SET_IMAGE_UNDER_CONFIGURATION':
						return a.payload;

					case 'IMAGE_CONFIG/CLOSE_IMAGE_UNDER_CONFIGURATION':
						return defaultState;

					case 'IMAGE_CONFIG/CREATE_NEW_BREAKPOINT':
						return {
							...s,
							breakpoints: [
								makeNewUIBreakpoint(),
								...s.breakpoints,
							],
						};
					// NB this respects the existing order of breakpoints.  Important for
					// 'SUCCESS' action.  This is only for LOCAL state,
					// does not trigger the 'hasUpdated' property--that is reserved
					// for updates made to the backend.

					case 'IMAGE_CONFIG/UPDATE_ONE_BREAKPOINT':
						return {
							...s,
							isSynchronizedWithBackend: false,
							breakpoints: s.breakpoints.map((bp) =>
								bp._id === a.payload._id ? a.payload : bp
							),
						};
					case 'IMAGE_CONFIG/DELETE_BREAKPOINT':
						return {
							...s,
							isSynchronizedWithBackend: false,
							breakpoints: s.breakpoints.filter(
								(bp) => bp._id !== a.payload
							),
						};

					case 'IMAGE_CONFIG/SYNC_REQUEST_INITIALIZED':
						return {
							...s,
							requestPending: true,
						};

					case 'IMAGE_CONFIG/BREAKPOINT_SYNC_SUCCESS':
						return {
							...s,
							requestPending: false,
							isSynchronizedWithBackend: true,
							breakpoints: a.payload.breakpoints,
						};

					case 'IMAGE_CONFIG/BREAKPOINT_SYNC_FAILED':
						return {
							...s,
							requestPending: false,
							isSynchronizedWithBackend: false,
							error: a.payload,
						};
					default:
						return s;
				}
			}
		)
	);
};
