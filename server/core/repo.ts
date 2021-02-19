import { MongoClient, RootQuerySelector } from 'mongodb';
import { BaseError, HTTPErrorTypes, HTTPErrorType } from './error';

// Notice that we don't specify the database string.  In this case,
// MongoClient.db will default to the db in the connection string
export const getCollection = <T>(collection: string) => (client: MongoClient) =>
    client.db().collection<T>(collection);

// Error classes
export class MongoConnectionError extends BaseError {
    public static create(uri: string, e?: any) {
        const devMessage = `Mongo client was unable to connect to database at the following location: ${uri}`;
        return new MongoConnectionError(
            devMessage,
            HTTPErrorTypes.INTERNAL_SERVER_ERROR,
            e
        );
    }
    private constructor(devMessage: string, httpErr: HTTPErrorType, raw: any) {
        super(devMessage, httpErr, raw);
    }
}

export class DBReadError extends BaseError {
    public static create<T extends object>(
        collection: string,
        query: RootQuerySelector<T>,
        raw: any
    ) {
        const devMessage = `Database read operation failed when querying collection: ${collection} with query: ${JSON.stringify(
            query
        )}`;
        return new DBReadError(devMessage, raw);
    }
    private constructor(devMessage: string, raw: any) {
        super(devMessage, HTTPErrorTypes.INTERNAL_SERVER_ERROR, raw);
    }
}

export class DBWriteError extends BaseError {
    public static create<T extends object>(
        collection: string,
        docType: T,
        raw: any
    ) {
        const devMessage = `Database write operation failed while writing the following document:\n${JSON.stringify(
            docType
        )}`;
        return new DBWriteError(devMessage, raw);
    }
    private constructor(devMessage: string, raw: any) {
        super(devMessage, HTTPErrorTypes.INTERNAL_SERVER_ERROR, raw);
    }
}
