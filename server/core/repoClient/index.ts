import { MongoClient } from 'mongodb';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';
import { BaseError, HTTPErrorTypes, HTTPErrorType } from '../error';

export type TGetRepoResult = TE.TaskEither<MongoConnectionError, MongoClient>;

export interface IGetRepoClient {
    (...args: any[]): TGetRepoResult;
}

export const _getClient: IGetRepoClient = (
    uri: string,
    clientConstructor: typeof MongoClient
) =>
    TE.tryCatch<MongoConnectionError, MongoClient>(
        () => clientConstructor.connect(uri, { loggerLevel: 'debug' }),
        (e) => MongoConnectionError.create(uri, e)
    );

export const getClient: IGetRepoClient = () =>
    process.env.MONGO_SERVER_URI
        ? _getClient(process.env.MONGO_SERVER_URI, MongoClient)
        : TE.left(
              MongoConnectionError.create(
                  'process.env.MONGO_SERVER_URI was not defined'
              )
          );

class MongoConnectionError extends BaseError {
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

// re-export for convenience
export { MongoClient } from 'mongodb';
export * as TE from 'fp-ts/lib/TaskEither';
export { pipe } from 'fp-ts/lib/pipeable';
