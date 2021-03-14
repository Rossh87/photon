import { Predicate } from 'fp-ts/lib/function';

export function isNullish<T>(v: unknown): v is NonNullable<T> {
	return !(v === null || v === undefined);
}
