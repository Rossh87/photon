import grant, { GrantConfig } from 'grant';

const g_client_secret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
const g_client_id = process.env.GOOGLE_OAUTH_CLIENT_APP_ID;
const github_client_id = process.env.GITHUB_OAUTH_CLIENT_ID;
const github_client_secret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
const apiRoot = process.env.API_ROOT;

const credentials = [
	g_client_id,
	g_client_secret,
	github_client_id,
	github_client_secret,
	apiRoot,
];

const credentialNameMap = [
	'GOOGLE_OAUTH_CLIENT_APP_ID',
	'GOOGLE_OAUTH_CLIENT_SECRET',
	'GOOGLE_OAUTH_CLIENT_APP_ID',
	'GITHUB_OAUTH_CLIENT_SECRET',
	'API_ROOT',
];

// completely implode if these are missing--app won't work at all
const checkEnv = () => {
	const missing: number[] = [];

	credentials.forEach((cred, idx) => {
		if (typeof cred !== 'string') {
			missing.push(idx);
		}
	});

	if (missing.length > 0) {
		const errString = missing.reduce((s, missingNumber) => {
			s += `Missing from env: ${credentialNameMap[missingNumber]}\n`;
			return s;
		}, '');

		console.error(errString);

		throw new Error('Grant config: missing required environment variables');
	}

	return;
};

checkEnv();

const grantConfig: GrantConfig = {
	defaults: {
		origin: apiRoot,
		transport: 'session',
		state: true,
	},
	google: {
		pkce: true,
		client_id: g_client_id,
		secret: g_client_secret,
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email',
		],
		nonce: true,
		callback: `${apiRoot}/auth/google/callback`,
	},
	github: {
		pkce: true,
		client_id: github_client_id,
		secret: github_client_secret,
		scope: ['read:user'],
		nonce: true,
		callback: `${apiRoot}/auth/github/callback`,
	},
};

export default grantConfig;
