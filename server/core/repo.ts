import {
	MongoClient,
	// RootQuerySelector,
	Collection,
	OptionalId,
	Filter,
	UpdateFilter,
	FindOptions,
	// FilterQuery,
	// UpdateQuery,
	// FindOneOptions,
	// WithoutProjection,
} from 'mongodb';
import { BaseError, HTTPErrorTypes, HTTPErrorType } from './error';
import * as TE from 'fp-ts/lib/TaskEither';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { reverseTwo } from './utils/reverseCurried';
import { fromNullable, foldW } from 'fp-ts/lib/Option';

export const getCollection =
	<T>(collection: string) =>
	(client: MongoClient) =>
		client.db('photon').collection<T>(collection);

export const _getCollection = reverseTwo(getCollection);

export const trySaveOne =
	<T>(document: OptionalId<T>) =>
	(c: Collection<T>) =>
		TE.tryCatch(
			pipe(
				() => c.insertOne(document),
				T.map((writeResult) => ({
					...document,
					_id: writeResult.insertedId,
				}))
			),
			(reason) => DBWriteError.create(c.collectionName, document, reason)
		);

export const _trySaveOne = reverseTwo(trySaveOne);

export const tryUpdateOne =
	<T>(filter: Filter<T>) =>
	(updateQuery: UpdateFilter<T>) =>
	(c: Collection<T>) =>
		TE.tryCatch(
			() =>
				c.findOneAndUpdate(filter, updateQuery, {
					returnDocument: 'after',
				}),
			(reason) => DBUpdateError.create(c.collectionName, filter, reason)
		);

export const tryFindArray =
	<T, K extends Partial<T> = T>(filter: Filter<T>) =>
	(options?: FindOptions<T>) =>
	(c: Collection<T>) =>
		pipe(
			options,
			fromNullable,
			foldW(
				() =>
					TE.tryCatch(
						() => c.find(filter).toArray(),
						(reason) =>
							DBReadError.create(c.collectionName, filter, reason)
					),
				// TODO: any type here is not good...
				(opts: any) =>
					TE.tryCatch(
						() => c.find<K>(filter, opts).toArray(),
						(reason) =>
							DBReadError.create(c.collectionName, filter, reason)
					)
			)
		);

export const tryFindOne =
	<T, K extends Partial<T> = T>(filter: Filter<T>) =>
	(options?: FindOptions<T>) =>
	(c: Collection<T>) =>
		pipe(
			options,
			fromNullable,
			foldW(
				() =>
					TE.tryCatch(
						() => c.findOne(filter),
						(reason) =>
							DBReadError.create(c.collectionName, filter, reason)
					),
				// TODO: any type here is not good...
				(opts: any) =>
					TE.tryCatch(
						() => c.findOne<K>(filter, opts),
						(reason) =>
							DBReadError.create(c.collectionName, filter, reason)
					)
			)
		);

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

export type DBError = DBReadError | DBWriteError | DBUpdateError;

export class DBReadError extends BaseError {
	public static create(collection: string, query: Filter<any>, raw: any) {
		const devMessage = `Database read operation failed when querying collection: ${collection} with query: ${JSON.stringify(
			query
		)}`;
		return new DBReadError(devMessage, raw);
	}
	private constructor(devMessage: string, raw: any) {
		super(devMessage, HTTPErrorTypes.INTERNAL_SERVER_ERROR, raw);
	}
}

export class DBDeletionError extends BaseError {
	public static create<T extends object>(
		collection: string,
		query: Filter<T>,
		raw: any
	) {
		const devMessage = `Deletion from collection: ${collection} with query: ${JSON.stringify(
			query
		)} failed.  See "raw" error for details`;
		return new DBDeletionError(devMessage, raw);
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
		)} to the ${collection} collection`;
		return new DBWriteError(devMessage, raw);
	}
	private constructor(devMessage: string, raw: any) {
		super(devMessage, HTTPErrorTypes.INTERNAL_SERVER_ERROR, raw);
	}
}

export class DBUpdateError extends BaseError {
	public static create<T extends object>(
		collection: string,
		filter: T,
		raw: any
	) {
		const devMessage = `Database update operation failed for document matching the following filter: ${JSON.stringify(
			filter
		)}, on collection ${collection}`;
		return new DBUpdateError(devMessage, raw);
	}
	private constructor(devMessage: string, raw: any) {
		super(devMessage, HTTPErrorTypes.INTERNAL_SERVER_ERROR, raw);
	}
}

export class MissingCollectionOrDBError extends BaseError {
	public static create(missingCollectionOrDB: string, raw: any) {
		const devMessage = `Database connection failed because the following db or collection was missing: ${missingCollectionOrDB}`;
		return new MissingCollectionOrDBError(devMessage, raw);
	}
	private constructor(devMessage: string, raw: any) {
		super(devMessage, HTTPErrorTypes.INTERNAL_SERVER_ERROR, raw);
	}
}

export class DBTransactionError extends BaseError {
	public static create(devMessage: string, raw: any) {
		return new DBTransactionError(devMessage, raw);
	}
	private constructor(devMessage: string, raw: any) {
		super(devMessage, HTTPErrorTypes.INTERNAL_SERVER_ERROR, raw);
	}
}
