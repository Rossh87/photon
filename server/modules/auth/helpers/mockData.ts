import { IGoogleOAuthResponse } from '../sharedAuthTypes';
import { TDBUser, IUserProfileProperties } from 'sharedTypes/User';
import { ObjectId, WithId } from 'mongodb';

export const mockGoogleOAuthResponse: IGoogleOAuthResponse = {
    resourceName: 'resourceName/123456',
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

export const mockUserFromGoogleResponse: IUserProfileProperties = {
    identityProvider: 'google',
    identityProviderID: '123456',
    thumbnailURL: 'https://myphotos@myphotos.com',
    displayName: 'Tim123',
    familyName: 'Roosevelt',
    givenName: 'Tim',
    registeredEmail: 'tim@gmail.com',
    registeredEmailVerified: true,
};

export const mockObjectID = ObjectId.createFromTime(1000);

export const mockUserFromDatabase: TDBUser = {
    _id: mockObjectID,
    identityProvider: 'google',
    identityProviderID: '123456',
    thumbnailURL: 'https://myphotos@myphotos.com',
    displayName: 'Tim123',
    familyName: 'Roosevelt',
    givenName: 'Tim',
    registeredEmail: 'tim@gmail.com',
    registeredEmailVerified: true,
    registeredDomains: ['mySite.com'],
    uploadUsage: 100,
    imageCount: 5,
    accessLevel: 'demo',
    userPreferences: {
        preferredDisplayName: 'TimmyTims',
    },
};

export const mockIncomingOAuthUserData: IUserProfileProperties = {
    identityProvider: 'google',
    identityProviderID: '123456',
    thumbnailURL: 'https://myphotos@myphotos.com',
    displayName: 'Tim123',
    familyName: 'Roosevelt',
    givenName: 'Tim',
    registeredEmail: 'tim@gmail.com',
    registeredEmailVerified: true,
};
