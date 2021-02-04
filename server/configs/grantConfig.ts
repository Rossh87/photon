import grant, { GrantConfig } from 'grant';

const grantConfig: GrantConfig = {
    defaults: {
        origin: 'http://localhost:8000',
        transport: 'session',
        state: true,
    },
    google: {
        pkce: true,
        client_id: process.env.GOOGLE_CLIENT_ID,
        secret: process.env.GOOGLE_CLIENT_SECRET,
        scope: ['openid'],
        nonce: true,
        callback: 'http://localhost:8000/hello',
    },
};

export default grantConfig;
