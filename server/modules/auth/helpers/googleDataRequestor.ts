import { Result } from 'ts-result';
import {
    IOAuthDataRequestor,
    IGoogleOAuthResponse,
    IRequestLibrary,
} from '../authTypes';
import { GOOGLE_PEOPLE_OAUTH_ENDPOINT } from '../../../CONSTANTS';
import { GoogleDataRequestErr } from '../errors/GoogleDataRequestErr';
import axios from 'axios';

export const _googleDataRequestor: IOAuthDataRequestor<
    IRequestLibrary,
    IGoogleOAuthResponse,
    GoogleDataRequestErr
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

export const googleDataRequestor = _googleDataRequestor(axios);
