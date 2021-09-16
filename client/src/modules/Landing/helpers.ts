import { AxiosError } from 'axios';
import { pipe } from 'fp-ts/lib/function';
import { fromNullable, map, getOrElse } from 'fp-ts/Option';

const mapStatusToMessage = (statusCode: number) => {
	switch (statusCode) {
		case 500:
			return 'The server encountered an error and was unable to process your request';
		case 429:
			return 'Maximum number of failed attempts reached. Please wait before retrying';
		case 401:
			return 'Email or password are invalid';
		case 403:
			return 'Email address unavailable';
		default:
			return 'Oops, something went wrong!  Please try again.';
	}
};

// Care here--pay attention to the order in which we pass in error setters
export const handleSigninOrSignupFailure =
	(componentErrSetter: (displayMessage: string) => void) =>
	(rejection: AxiosError) =>
		pipe(
			rejection.response?.status,
			fromNullable,
			map(mapStatusToMessage),
			getOrElse(() => 'Oops--something went wrong!  Please try again.'),
			componentErrSetter
		);
