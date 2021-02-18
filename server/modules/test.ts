import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/pipeable';
import * as RT from 'fp-ts/lib/ReaderTask';
import * as R from 'fp-ts/lib/Reader';

const getNum: T.Task<number> = () => new Promise((res) => res(42));

interface db {
    getUser: () => Promise<User>;
}

interface User {
    name: string;
    age: number;
}
const db: db = {
    getUser: () => new Promise((res) => res({ name: 'tim', age: 4 })),
};

const usr: User = {
    name: 'tim',
    age: 3,
};

const addTwo = (n: number) => n + 2;

const toString = (n: number) => String(n);

const run = (name: string): RT.ReaderTask<User, User> =>
    pipe(
        RT.ask<User>(),
        RT.map(() => name + '1'),
        RT.chain((newName) => RT.asks((db) => () => pipe()))
    );

run('bob')(usr);
