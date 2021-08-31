import { IUserProfileProperties } from 'sharedTypes/User';
import { right, left } from 'fp-ts/Either';
import { OAuthDataNormalizationError } from '../domain/OAuthDataNormalizationError';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';

// TODO: this is potentially fragile since it doesn't verify that an incoming property
// is of correct type, only that it's present and nonnullable.
export const verifyOAuthFields = (
	fields: {
		[K in keyof IUserProfileProperties]:
			| null
			| undefined
			| IUserProfileProperties[K];
	}
) => {
	const missingFields = (
		Object.keys(fields) as Array<keyof typeof fields>
	).reduce<Array<string>>(
		(errs, key) =>
			fields[key] !== null && fields[key] !== undefined
				? errs
				: [...errs, key],
		[]
	);

	return missingFields.length === 0
		? right(fields as IUserProfileProperties)
		: left(
				new OAuthDataNormalizationError(
					missingFields as NonEmptyArray<string>,
					fields
				)
		  );
};
