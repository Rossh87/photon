import { fetchAllUploadURIs } from '../helpers/fetchAllUploadURIs';
import { Request } from 'express';
import { IUploadRequestMetadata } from '../sharedUploadTypes';
import { fromNullable } from 'fp-ts/lib/Either';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import {
	toEffects,
	addAndApplyEffect,
	addEffect,
} from '../../../core/expressEffects';
import { pipe } from 'fp-ts/lib/function';
import { BaseError } from '../../../core/error';
import { CorsRequest } from 'cors';

export const handlUploadRequests = (
	req: Request<any, any, { uploads: NonEmptyArray<IUploadRequestMetadata> }>
) => {
	fetchAllUploadURIs(req.body.uploads);
};
