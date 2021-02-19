import { IUser } from '../userTypes';
import { BaseError, HTTPErrorTypes } from '../../../core/error';

export class MissingCollectionOrDBError extends BaseError {
    public static create(missingCollectionOrDB: string, raw: any) {
        const devMessage = `Database connection failed because the following db or collection was missing: ${missingCollectionOrDB}`;
        return new MissingCollectionOrDBError(devMessage, raw);
    }
    private constructor(devMessage: string, raw: any) {
        super(devMessage, HTTPErrorTypes.INTERNAL_SERVER_ERROR, raw);
    }
}
