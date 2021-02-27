import { BaseError } from '../core/error';

export class AuthError extends BaseError {
    public static create(e: any) {
        return new AuthError(
            'api authorization request failed, see "this.raw" for complete reason',
            e
        );
    }
    constructor(message: string, raw: any) {
        super(message, raw);
    }
}
