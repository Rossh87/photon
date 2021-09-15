import { Errors } from 'io-ts';
import { TDBUser, TSessionUser } from '../../../../sharedTypes/User';

export const isSessionUser = (u: TSessionUser | TDBUser): u is TSessionUser =>
	typeof u._id === 'string';

export const isErrors = (u: unknown): u is Errors =>
	Array.isArray(u) && u.length > 0 && typeof u[0].message === 'string';
