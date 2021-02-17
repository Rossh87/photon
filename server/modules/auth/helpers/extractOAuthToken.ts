import { Result } from 'ts-result';
import { IAccessTokenExtractor } from '../authTypes';

// TODO: clean up these conditionals
export const extractOAuthToken: IAccessTokenExtractor = (r) => {
    const { grant } = r.session;

    if (grant && grant.response.access_token) {
        return Result.right(grant.response.access_token);
    } else {
        return Result.left(
            new Error('grant: field "accessToken" unpopulated in auth callback')
        );
    }
};
