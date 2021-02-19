import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/pipeable';
import * as RT from 'fp-ts/lib/ReaderTask';
import * as R from 'fp-ts/lib/Reader';
import * as E from 'fp-ts/lib/Either';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import * as TE from 'fp-ts/lib/TaskEither';
import { flow } from 'fp-ts/lib/function';

const getNum: T.Task<number> = () => new Promise((res) => res(42));

interface IDB {
    getUser: () => Promise<User>;
}

interface User {
    name: string;
    age: number;
}
const db: IDB = {
    getUser: () => new Promise((res) => res({ name: 'tim', age: 4 })),
};

const usr: User = {
    name: 'tim',
    age: 3,
};

const addTwo = (n: number) => n + 2;

const toString = (n: number) => String(n);

// need pipeline that takes in a parameter, becomes a Reader mid-flow, and can read deps
// to combine 'input' with stuff from deps
const run: (n: string) => RTE.ReaderTaskEither<IDB, Error, User> = (
    name: string
) =>
    pipe(
        E.of<Error, string>(name),
        E.map<string, string>((n) => n + '1'),
        RTE.fromEither,
        RTE.chain<IDB, Error, string, User>((newName) =>
            R.asks(pipe(newName, setName))
        ),
        RTE.map((u) => {
            console.log(u);
            return u;
        })
    );

const getUser: (db: IDB) => TE.TaskEither<Error, User> = (db) =>
    TE.tryCatch(
        () => db.getUser(),
        (reason: any) => new Error(reason)
    );

const setName = (newName: string) => (db: IDB) =>
    pipe(
        db,
        getUser,
        TE.map((u) => {
            u.name = newName;
            return u;
        })
    );

run('tom')(db)();
