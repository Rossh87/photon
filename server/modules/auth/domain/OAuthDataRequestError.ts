import { TOAuthProvider } from '../../../../sharedTypes/User';
import { BaseError, HTTPErrorTypes } from '../../../core/error';

export class OAuthDataRequestError extends BaseError {
	public static create(oAuthProviderName: TOAuthProvider, raw: any) {
		return new OAuthDataRequestError(oAuthProviderName, raw);
	}

	public constructor(oAuthProviderName: TOAuthProvider, e: any) {
		const devErrMessage = `HTTP request for user's profile data from ${oAuthProviderName} was rejected`;
		super(devErrMessage, HTTPErrorTypes.BAD_GATEWAY, e);
	}
}
