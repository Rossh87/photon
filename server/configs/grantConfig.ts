import grant, { GrantConfig } from 'grant';

const g_client_secret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
const g_client_id = process.env.GOOGLE_OAUTH_CLIENT_APP_ID;
const github_client_id = process.env.GITHUB_OAUTH_CLIENT_ID;
const github_client_secret = process.env.GITHUB_OAUTH_CLIENT_SECRET;

const credentials = [
	g_client_id,
	g_client_secret,
	github_client_id,
	github_client_secret,
];

// completely implode if these are missing--app won't work at all
credentials.forEach((cred) => {
	if (cred === undefined) {
		throw new Error(
			'Grant config: missing needed credentials. Please check env variables'
		);
	}
});

const grantConfig: GrantConfig = {
	defaults: {
		origin: 'http://localhost:8000',
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
		callback: 'http://localhost:8000/auth/google/callback',
	},
	github: {
		pkce: true,
		client_id: github_client_id,
		secret: github_client_secret,
		scope: ['read:user'],
		nonce: true,
		callback: 'http://localhost:8000/auth/github/callback',
	},
};

export default grantConfig;
