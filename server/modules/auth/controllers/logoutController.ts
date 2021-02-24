import { RequestHandler } from 'express';
import { BaseError, HTTPErrorTypes } from '../../../core/error';

export const logoutController: RequestHandler = (req, res) => {
    // TODO: for now, blow up if logging out fails, since it's a security defect
    req.session.destroy((e) => {
        if (e !== undefined) {
            throw LogoutFailureError.create(e);
        } else {
            res.redirect('/');
        }
    });
};

export class LogoutFailureError extends BaseError {
    static create(e: any) {
        const devMessage =
            'Potential security vulnerability--session.destroy failed on logout attempt';
        return new LogoutFailureError(devMessage, e);
    }
    constructor(devMessage: string, e: any) {
        console.log(e);
        super(devMessage, HTTPErrorTypes.INTERNAL_SERVER_ERROR, e);
    }
}
