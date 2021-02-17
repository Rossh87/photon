import { HTTPErrorType } from './errorTypes';

export class BaseError extends Error {
    constructor(
        message: string,
        public readonly HTTPErrorType?: HTTPErrorType
    ) {
        super(message);
        this.HTTPErrorType = HTTPErrorType;
    }
}

export const HTTPErrorTypes: Record<string, HTTPErrorType> = {
    GATEWAY_TIMEOUT: {
        status: 504,
        message: 'Requested upstream resource was not available',
    },
};
