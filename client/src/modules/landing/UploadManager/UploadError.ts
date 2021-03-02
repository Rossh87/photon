import { monoidAny } from 'fp-ts/lib/Monoid';
import { BaseError } from '../../../core/error';

export class UploadError extends BaseError {
    public static create(message: string) {
        return new UploadError(message, null);
    }

    private constructor(message: string, raw: any) {
        super(message, raw);
    }
}
