// Possibly TODO: Tests for promises by looking for 'thenables'.  If userland code returns a non-promise
// object with property 'then', this will fail.  But why would anyone do that...?
export const asyncCompose = (...fns: Array<any>) => (x?: any) =>
    fns.reduceRight(
        (acc, fn) =>
            typeof acc === 'object' && acc.then !== undefined
                ? acc.then(fn, fn)
                : fn(acc),
        x
    );
