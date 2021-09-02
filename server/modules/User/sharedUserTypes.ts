import { IUserProfilePreferencesTransportObject } from '../../../sharedTypes/User';

export interface IProfilePrefsUpdateObject {
	payload: IUserProfilePreferencesTransportObject;
	profileID: string;
}
