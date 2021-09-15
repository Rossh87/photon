import { ObjectId } from 'mongodb';
import { IUserProfileProperties } from '../../../../sharedTypes/User';
import { TLocalSignupRequest } from '../sharedAuthTypes';

const getDefaultUserName = (email: string) => email.split('@')[0];

export const profilePropsFromLocalSignup =
	(pw: string) =>
	(signupRequest: TLocalSignupRequest): IUserProfileProperties => ({
		passwordHash: pw,
		registeredEmail: signupRequest.registeredEmailAddress,
		identityProvider: 'local',
		displayName: getDefaultUserName(signupRequest.registeredEmailAddress),

		// manually add id here, since we need it before we save to DB.
		// We'll insert insert it on the saved document.  Cast it
		// To avoid needing to immediately re-initialize it as an object id
		// in the next step.
		identityProviderID: new ObjectId() as unknown as string,
	});
