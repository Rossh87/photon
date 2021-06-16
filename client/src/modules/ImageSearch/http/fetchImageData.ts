import {
	IDependencies,
	extractResponseData,
	IHttpCall,
} from '../../../core/dependencyContext';
import { REQUEST_USER_IMG_DATA_ENDPOINT } from './endpoints';
import { TImageSearchActions } from '../state/imageSearchStateTypes';
import { tryCatch, TaskEither } from 'fp-ts/lib/TaskEither';
import { BaseError } from '../../../core/error';
import { TFetchedImageData } from '../domain/ImageSearchDomainTypes';
import { pipe } from 'fp-ts/lib/function';

const requestData: IHttpCall<TFetchedImageData[]> = (httpLib) =>
	httpLib.get(REQUEST_USER_IMG_DATA_ENDPOINT, { withCredentials: true });

export const fetchImageData = (
	deps: IDependencies<TImageSearchActions>
): TaskEither<void, void> =>
	tryCatch(
		() =>
			pipe(requestData, deps.http, extractResponseData).then((data) =>
				deps.dispatch({ type: 'IMG_DATA_RECEIVED', payload: data })
			),
		(e) =>
			deps.dispatch({
				type: 'IMG_SEARCH_ERR',
				payload: new BaseError(
					"http request for user's uploaded img data failed",
					e
				),
			})
	);
