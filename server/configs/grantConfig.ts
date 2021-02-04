import grant, { GrantConfig } from 'grant';

const g_client_secret = process.env.GOOGLE_CLIENT_SECRET;
const g_client_id = process.env.GOOGLE_CLIENT_ID;

if (g_client_id === undefined || g_client_secret === undefined) {
    throw new Error(
        'Grant config: missing needed credentials. Please check env variables'
    );
}

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
        scope: ['openid'],
        nonce: true,
        callback: 'http://localhost:8000/hello',
    },
};

export default grantConfig;
