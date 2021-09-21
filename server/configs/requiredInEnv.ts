import { TRequiredEnvVars } from '../core/readEnv';

const requiredInEnv: TRequiredEnvVars = [
	'SESSION_SECRET',
	'PORT',
	'GOOGLE_OAUTH_CLIENT_APP_ID',
	'GOOGLE_OAUTH_CLIENT_SECRET',
	'GOOGLE_STORAGE_ACCESS_SECRET',
	'GOOGLE_STORAGE_ACCESS_KEY',
	'LOSSY_USER_IMAGES_BUCKET',
	'GOOGLE_APPLICATION_CREDENTIALS',
];

export default requiredInEnv;
