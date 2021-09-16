import { flow } from 'fp-ts/lib/function';
import { chain, fold, fromPredicate } from 'fp-ts/lib/Option';
import { TConfigurableProfileProps } from '../modules/Profile/sharedProfileTypes';

const checkLength = fromPredicate(
	(s: string) => s.length <= 20 && s.length >= 8
);

const checkForUpper = fromPredicate((s: string) => /[A-Z]+/.test(s));

const checkForLower = fromPredicate((s: string) => /[a-z]+/.test(s));

const checkForSpecial = fromPredicate((s: string) => /[!@#$&*]+/.test(s));

const validatePassword = flow(
	checkLength,
	chain(checkForUpper),
	chain(checkForLower),
	chain(checkForSpecial),
	fold(
		() => false,
		() => true
	)
);

const passwordPattern = {
	test: validatePassword,
};

export const emailPattern =
	/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const urlPattern =
	/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

/**
 * Allows:
 * - alphanumeric chars (lower and upper)
 * - number
 * - dots
 * - underscores
 * - from 5 to 30 chars (inclusive at both ends)
 */
const displayNamePattern = /^[A-Za-z0-9\-\.]{5,30}$/;

interface IValidationPattern {
	test: (s: string) => boolean;
}

interface IValidationTools {
	failureMessage: string;
	pattern: IValidationPattern;
}

export const validationTools: Record<
	keyof TConfigurableProfileProps | 'password',
	IValidationTools
> = {
	emailAddress: {
		failureMessage: 'Please enter a valid email',
		pattern: emailPattern,
	},
	profileImage: {
		failureMessage: 'Please enter a valid URL',
		pattern: urlPattern,
	},
	userName: {
		failureMessage:
			"Username must consist of between 5 and 30 alphanumeric characters, or '-' or '.'",
		pattern: displayNamePattern,
	},

	password: {
		failureMessage:
			'Password must be 8-20 chars and contain at least one of each of the following: uppercase letter, lowercase letter, and !,@,#,$,&, or *',
		pattern: passwordPattern,
	},
};

export const isConfigurableField = (
	s: string
): s is keyof TConfigurableProfileProps =>
	s === 'emailAddress' || s === 'profileImage' || s === 'userName';
