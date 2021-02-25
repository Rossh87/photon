import { IUser, TBlankUser, IDefaultState } from './types';
import React from 'react';

export const defaultUser: TBlankUser = {
    OAuthProviderName: null,
    localAppID: null,
    thumbnailURL: null,
    displayName: null,
    familyName: null,
    givenName: null,
    emailAddress: null,
};

export const defaultState: IDefaultState = {
    user: defaultUser,
    errors: [],
};
