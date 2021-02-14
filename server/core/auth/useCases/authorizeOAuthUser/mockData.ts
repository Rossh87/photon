import { IGoogleOAuthResponse, IUser } from '../../authTypes';

export const mockGoogleOAuthResponse: IGoogleOAuthResponse = {
    resourceName: 'resourceName',
    etag: 'abc123',
    names: [
        {
            metadata: {
                primary: true,
                source: {
                    type: 'PROFILE',
                    id: '123456',
                },
            },
            displayName: 'Tim123',
            familyName: 'Roosevelt',
            givenName: 'Tim',
            displayNameLastFirst: 'Roosevelt, Tim',
            unstructuredName: 'Tim Roosevelt',
        },
    ],
    emailAddresses: [
        {
            metadata: {
                primary: true,
                verified: true,
                source: {
                    type: 'ACCOUNT',
                    id: '123456',
                },
            },
            value: 'tim@gmail.com',
        },
    ],
    photos: [
        {
            url: 'https://myphotos@myphotos.com',
            metadata: {
                primary: true,
                source: {
                    type: 'PROFILE',
                    id: '123456',
                },
            },
            primary: true,
        },
    ],
};

export const mockUserFromGoogleResponse: IUser = {
    OAuthProviderName: 'google',
    OAuthProviderID: '123456',
    thumbnailURL: 'https://myphotos@myphotos.com',
    displayName: 'Tim123',
    familyName: 'Roosevelt',
    givenName: 'Tim',
    primayEmail: 'tim@gmail.com',
    role: 'tourist',
};
