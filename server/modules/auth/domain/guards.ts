import { TDBUser, TSessionUser } from '../../../../sharedTypes/User';

export const isSessionUser = (u: TSessionUser | TDBUser): u is TSessionUser =>
	typeof u._id === 'string';
