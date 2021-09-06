export interface HTTPErrorType {
	status: number;
	clientMessage: string;
}

export class BaseError extends Error {
	public constructor(
		public readonly message: string,
		public readonly HTTPErrorType: HTTPErrorType,
		public readonly raw?: any
	) {
		super(message);
		this.HTTPErrorType = HTTPErrorType;
	}
}

export const HTTPErrorTypes: Record<string, HTTPErrorType> = {
	UNAUTHORIZED: {
		status: 401,
		clientMessage: 'Needed credentials were invalid or missing',
	},

	FORBIDDEN: {
		status: 403,
		clientMessage: 'Attempted to access an unauthorized resource',
	},

	MISSING_OR_CONFLICTED_RESOURCE: {
		status: 409,
		clientMessage:
			'Server was unable to locate the requested resource, or could not perform the requested action due to a conflict',
	},

	INTERNAL_SERVER_ERROR: {
		status: 500,
		clientMessage:
			'Server encountered an error and was unable to process your request',
	},

	BAD_GATEWAY: {
		status: 502,
		clientMessage:
			'Server was unable to reach, or received an invalid response from, a needed remote resource',
	},

	GATEWAY_TIMEOUT: {
		status: 504,
		clientMessage: 'Requested upstream resource was not available',
	},
};
