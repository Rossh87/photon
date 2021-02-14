import { Result } from 'ts-result';
import {
    IOAuthDataRequestor,
    IGoogleOAuthResponse,
    IRequestLibrary,
    IGoogleDataRequestErr,
} from '../../authTypes';
import { GOOGLE_PEOPLE_OAUTH_ENDPOINT } from '../../../../CONSTANTS';
import { BaseError } from '../../../error';
import axios from 'axios';

export const googleDataRequestor: IOAuthDataRequestor<
    IRequestLibrary,
    IGoogleOAuthResponse,
    IGoogleDataRequestErr
> = (requestLibrary) => async (token) => {
    let res;
    try {
        res = await requestLibrary.get(GOOGLE_PEOPLE_OAUTH_ENDPOINT, {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        });

        return Result.right(res.data);
    } catch (e) {
        return Result.left(new GoogleDataRequestErr(e));
    }
};

export class GoogleDataRequestErr
    extends BaseError
    implements IGoogleDataRequestErr {
    constructor(e: any) {
        super({ hint: 'Request for Google OAuth data failed', raw: e });
    }
}

export const _googleDataRequestor = googleDataRequestor(axios);
