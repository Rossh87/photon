export interface HTTPErrorType {
    status: number;
    clientMessage: string;
}

export class BaseError extends Error {
    constructor(
        public readonly message: string,
        public readonly HTTPErrorType: HTTPErrorType,
        public readonly raw?: any
    ) {
        super(message);
        this.HTTPErrorType = HTTPErrorType;
    }
}

export const HTTPErrorTypes: Record<string, HTTPErrorType> = {
    GATEWAY_TIMEOUT: {
        status: 504,
        clientMessage: 'Requested upstream resource was not available',
    },

    UNAUTHORIZED: {
        status: 401,
        clientMessage: 'Needed credentials were invalid or missing',
    },
};
