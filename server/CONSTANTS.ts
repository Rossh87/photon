export const GOOGLE_PEOPLE_OAUTH_ENDPOINT =
	'https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos';

// good to deploy
export const TEST_DB_URI = 'mongodb://localhost:27017';

// NOTE that this only gets used in tests, not live app
export const CLIENT_ROOT = 'http://localhost:3000';

export const GITHUB_USER_OAUTH_ENDPOINT = 'https://api.github.com/user';

export const MAX_FAILED_LOGINS_PER_HOUR = 8;

export const FAILED_LOGINS_EXCEEDED_LOCKOUT = 60 * 60 * 24;

export const MAX_DEMO_UPLOAD_COUNT = 10;
