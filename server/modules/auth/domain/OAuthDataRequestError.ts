import { TIdentityProvider } from '../../../../sharedTypes/User';
import { BaseError, HTTPErrorTypes } from '../../../core/error';

export class OAuthDataRequestError extends BaseError {
    public static create(identityProvider: TIdentityProvider, raw: any) {
        return new OAuthDataRequestError(identityProvider, raw);
    }

    public constructor(identityProvider: TIdentityProvider, e: any) {
        const devErrMessage = `HTTP request for user's profile data from ${identityProvider} was rejected`;
        super(devErrMessage, HTTPErrorTypes.BAD_GATEWAY, e);
    }
}
