import { BaseError, HTTPErrorTypes } from '../../../core/error';

export class GoogleDataRequestErr extends BaseError {
    constructor(message: string) {
        super(message, HTTPErrorTypes.GATEWAY_TIMEOUT);
    }
}
