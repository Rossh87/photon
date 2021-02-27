import { getUpdatedUser } from './getUpdatedUser';
import { mockUserFromDatabase } from '../../auth/helpers/mockData';
import { IDBUser, IUser } from '../sharedUserTypes';
import { pipe } from 'fp-ts/lib/pipeable';
import * as E from 'fp-ts/lib/Either';

let savedUser: IDBUser;
beforeEach(() => {
    savedUser = Object.assign({}, mockUserFromDatabase);
});

describe('function to merge current OAuth user data with saved user data', () => {
    it('replaces saved data on User object with fresher OAuth response data', () => {
        const incoming: IUser = Object.assign({}, savedUser);

        delete incoming._id;

        Object.defineProperty(incoming, 'displayName', { value: 'newName' });

        const received = getUpdatedUser(savedUser)(incoming);

        pipe(
            received,
            E.fold(
                () => {
                    throw new Error('this should never be called');
                },
                (result) => expect(result.displayName).toEqual('newName')
            )
        );
    });

    it('retains the same _id property even if updates are made', () => {
        const incoming: IUser = Object.assign({}, savedUser);

        delete incoming._id;

        Object.defineProperty(incoming, 'displayName', { value: 'newName' });

        const received = getUpdatedUser(savedUser)(incoming);

        pipe(
            received,
            E.fold(
                () => {
                    throw new Error('this should never be called');
                },
                (result) => expect(result._id).toEqual(savedUser._id)
            )
        );
    });

    it('passes the saved user data through if there are no updates', () => {
        const incoming: IUser = Object.assign({}, savedUser);

        delete incoming._id;

        const received = getUpdatedUser(savedUser)(incoming);

        pipe(
            received,
            E.fold(
                (result) => expect(result).toEqual(savedUser),
                () => {
                    throw new Error('this should never be called');
                }
            )
        );
    });
});
