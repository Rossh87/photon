import { IUserProfilePreferencesTransportObject } from '../../../../sharedTypes/User';
import { IProfilePrefsUpdateObject } from '../sharedUserTypes';

export const preferencesToPrefPayload = (
	a: IUserProfilePreferencesTransportObject,
	id: string
): IProfilePrefsUpdateObject => ({ payload: a, profileID: id });
