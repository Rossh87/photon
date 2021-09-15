import {
    IGoogleOAuthResponse,
    IGooglePhotosObject,
    IGoogleNamesObject,
    IGoogleEmailsObject,
    TGoogleOAuthSubData,
    GoogleOAuthResponse,
    GoogleMetadataObject,
} from '../sharedAuthTypes';
import { IUserProfileProperties } from 'sharedTypes/User';
import { BaseError, HTTPErrorTypes } from '../../../core/error';
import * as E from 'fp-ts/lib/Either';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { OAuthDataNormalizationError } from '../domain/OAuthDataNormalizationError';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/lib/function';

type DecodedGoogleResponse = t.TypeOf<typeof GoogleOAuthResponse>;
type GoogleMetaData = t.TypeOf<typeof GoogleMetadataObject>;

const getPrimary = <T extends { metadata: GoogleMetaData }>(as: Array<T>) =>
    as.filter((o) => o.metadata.primary === true)[0];

const googleResponseToProfileProps = (
    res: DecodedGoogleResponse
): IUserProfileProperties => {
    const { displayName, familyName, givenName } = getPrimary(res.names);
    const emailData = getPrimary(res.emailAddresses);
    const photoURL = res.photos && getPrimary(res.photos);
    const identityProviderID = res.resourceName.split('/')[1];

    return {
        identityProvider: 'google',
        identityProviderID,
        thumbnailURL: photoURL?.url,
        displayName: displayName,
        familyName,
        givenName,
        registeredEmail: emailData.value,
        registeredEmailVerified: emailData.metadata.verified,
    };
};

export const normalizeGoogleResponse = (res: unknown) =>
    pipe(
        res,
        GoogleOAuthResponse.decode,
        E.map(googleResponseToProfileProps),
        E.mapLeft((e) => OAuthDataNormalizationError.create(e, res))
    );
