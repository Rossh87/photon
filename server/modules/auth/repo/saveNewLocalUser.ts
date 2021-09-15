import { MongoClient, ObjectId } from 'mongodb';
import { IUserProfileProperties } from 'sharedTypes/User';
import * as TE from 'fp-ts/TaskEither';
import { DBWriteError, getCollection } from '../../../core/repo';
import { prepNewUserForSave } from '../../User/repo/saveNewUser';
import { pipe } from 'fp-ts/lib/function';

export const saveNewLocalUser =
	(newUser: IUserProfileProperties) => (repoClient: MongoClient) => {
		const userCollection = getCollection('users')(repoClient);
		// add _id field here manually, since we created it already in the process of
		// getting an IUserProfileProperties
		const userWithUsageProps = prepNewUserForSave(newUser);
		const toInsert = {
			...userWithUsageProps,
			_id: userWithUsageProps.identityProviderID as unknown as ObjectId,
		};

		return pipe(
			TE.tryCatch(
				() => userCollection.insertOne(toInsert),
				(reason) =>
					DBWriteError.create(
						userCollection.collectionName,
						document,
						reason
					)
			),
			// return the inserted document on success
			TE.map(() => toInsert)
		);
	};
