import { TRequiredEnvVars } from '../core/readEnv';

const requiredInEnv: TRequiredEnvVars = [
	'SESSION_SECRET',
	'PORT',
	'GOOGLE_OAUTH_CLIENT_APP_ID',
	'GOOGLE_OAUTH_CLIENT_SECRET',
	'GOOGLE_STORAGE_ACCESS_SECRET',
	'GOOGLE_STORAGE_ACCESS_KEY',
	'GOOGLE_STORAGE_BUCKET_NAME',
];

export default requiredInEnv;
