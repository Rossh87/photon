import {
    IGoogleOAuthResponse,
    IGooglePhotosObject,
    IGoogleNamesObject,
    IGoogleEmailsObject,
    INormalizer,
    TGoogleOAuthSubData,
} from '../sharedAuthTypes';

// TODO: this path sucks
import { IUser } from '../../User/sharedUserTypes';
import { BaseError, HTTPErrorTypes } from '../../../core/error';
import * as E from 'fp-ts/lib/Either';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';

// TODO: we could allow some of this info to be incomplete and flag it on the user model
// to be completed by user in our own app
export type TNormalizeGoogleResponse = INormalizer<
    GoogleNormalizationError,
    IGoogleOAuthResponse,
    IUser
>;

export type TGoogleNormalizerResult = E.Either<GoogleNormalizationError, IUser>;

export const normalizeGoogleResponse: TNormalizeGoogleResponse = (a) => {
    const result: any = {
        OAuthProviderName: 'google',
    };

    const photoURL = a.photos ? getPrimaryImageURL(a.photos) : null;
    const nameData = a.names ? processNameData(a.names) : null;
    const emailData = a.emailAddresses
        ? getPrimaryEmail(a.emailAddresses)
        : null;

    result.OAuthProviderID = a.resourceName?.split('/')[1];
    result.thumbnailURL = photoURL;
    result.displayName = nameData?.displayName;
    result.familyName = nameData?.familyName;
    result.givenName = nameData?.givenName;
    result.OAuthEmail = emailData?.OAuthEmail;
    result.OAuthEmailVerified = emailData?.OAuthEmailVerified;

    const missingFields = Object.keys(result as IUser).reduce<Array<string>>(
        (errs, key) => (result[key] ? errs : [...errs, key]),
        []
    );

    return missingFields.length
        ? E.left(
              GoogleNormalizationError.create(
                  missingFields as NonEmptyArray<string>,
                  a
              )
          )
        : E.right(result as IUser);
};

export class GoogleNormalizationError extends BaseError {
    static create(
        errs: NonEmptyArray<string>,
        received: Partial<IGoogleOAuthResponse>
    ) {
        return new GoogleNormalizationError(errs, received);
    }

    constructor(
        errs: NonEmptyArray<string>,
        received: Partial<IGoogleOAuthResponse>
    ) {
        const errString = errs.join(', ');
        const devMessage = `OAuth response normalization failed.  The following properties are missing or invald: ${errString}`;
        super(devMessage, HTTPErrorTypes.BAD_GATEWAY, received);
    }
}

const getPrimaryImageURL: (
    images?: Array<IGooglePhotosObject>
) => string | null = (images) => {
    const res = images
        ? images.filter((o) => o.metadata.primary === true)
        : null;
    return res && res.length ? res[0].url : null;
};

const processNameData: (
    names?: Array<IGoogleNamesObject>
) => Partial<IUser> | null = (names) => {
    const primaryName = names
        ? names.filter((o) => o.metadata.primary === true)
        : null;

    if (primaryName?.length) {
        const { displayName, familyName, givenName } = primaryName[0];
        return { displayName, familyName, givenName };
    } else {
        return null;
    }
};

const getPrimaryEmail: (
    emails?: Array<IGoogleEmailsObject>
) => Partial<IUser> | null = (emails) => {
    const primaryEmails = emails
        ? emails.filter((o) => o.metadata.primary === true)
        : null;

    if (primaryEmails?.length) {
        const result = {
            OAuthEmail: primaryEmails[0].value,
            OAuthEmailVerified: primaryEmails[0].metadata.verified,
        };
        return result;
    } else {
        return null;
    }
};
