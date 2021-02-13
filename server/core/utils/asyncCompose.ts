// Possibly TODO: Tests for promises by looking for 'thenables'.  If userland code returns a non-promise
// object with property 'then', this will fail.  But why would anyone do that...?
import { Result } from 'ts-result';
import { isEither } from './toMappable';
const wrapResolution = (v: any) =>
    isEither(v) ? Object.assign({}, v) : Result.right(v);

const wrapRejection = (v: any) =>
    isEither(v) ? Object.assign({}, v) : Result.left(v);

export const asyncCompose = (...fns: Array<any>) => (x?: any) =>
    fns.reduceRight(
        (acc, fn) =>
            typeof acc === 'object' && acc.then !== undefined
                ? acc.then(
                      asyncCompose(fn, wrapResolution),
                      asyncCompose(fn, wrapRejection)
                  )
                : fn(acc),
        x
    );
