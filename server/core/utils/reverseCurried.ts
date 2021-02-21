export interface IRev2<A, B, C> {
    (curriedFn: ICurried2<A, B, C>): ICurried2<B, A, C>;
}

export interface ICurried2<A, B, C> {
    (a: A): (b: B) => C;
}

export const reverseTwo = <A, B, C>(
    fn: ICurried2<A, B, C>
): ICurried2<B, A, C> => (b: B) => (a: A) => fn(a)(b);
