import { Result } from 'ts-result';
import { IAccessTokenExtractor } from './authTypes';

// TODO: clean up these conditionals
export const extractToken: IAccessTokenExtractor = (r) => {
    const token = r.session.grant?.response?.access_token;

    return token
        ? Result.right(token)
        : Result.left(
              new Error(
                  'grant: field "accessToken" unpopulated in auth callback'
              )
          );
};
