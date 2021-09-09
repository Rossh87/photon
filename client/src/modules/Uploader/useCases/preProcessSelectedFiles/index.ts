import {
	TPreprocessArgs,
	TNonEmptyPreprocessArgs,
	IImageWithErrors,
	IImage,
} from '../../domain/domainTypes';
import { pipe, flow } from 'fp-ts/lib/function';
import { map as NEAMap } from 'fp-ts/lib/NonEmptyArray';
import { appendMetadataToFile } from './appendMetadata';
import { validateFileSize } from './validateFileSize';
import { flagDuplicates } from './flagDuplicates';
import { map as RTEMap, chain as RTEChain } from 'fp-ts/ReaderTaskEither';
import { chain as RTChain, asks as RTAsks, of as RTOf } from 'fp-ts/ReaderTask';
import { fold as EFold, map as EMap, mapLeft as EMapLeft } from 'fp-ts/Either';
import { checkAvailableUploads } from './checkAvailableUploads';
import { PayloadFPReader } from 'react-use-fp';
import { TUploaderActions } from '../../state/uploadStateTypes';
import { IDependencies } from '../../../../core/dependencyContext';
import { TAuthActions } from '../../../Auth/state/authStateTypes';
import { Dispatch } from 'react';
import { emitBasicErrMessage } from '../../../Auth/state/useAuthState';

// Calling code ensures FileList isn't empty.  This function just converts
// FileList to a normal array and asserts that it's NonEmpty
const toArray = ([fileList, user]: TPreprocessArgs) =>
	pipe(
		fileList,
		Array.from,
		(files) => [files, user] as TNonEmptyPreprocessArgs
	);

const formatFiles = ([files, user]: TNonEmptyPreprocessArgs) =>
	pipe(files, NEAMap(flow(appendMetadataToFile(user._id), validateFileSize)));

// sort of hacky way to get file data out of Either wrapper before
// it goes to React reducer
const unwrapEither = EFold<IImageWithErrors, IImage, IImageWithErrors | IImage>(
	(e) => e,
	(r) => r
);

export const preprocessImages: PayloadFPReader<
	TUploaderActions,
	TPreprocessArgs,
	IDependencies<TUploaderActions> & { authDispatch: Dispatch<TAuthActions> }
> = flow(
	checkAvailableUploads,
	EMap(toArray),
	EMap(formatFiles),
	RTOf,
	RTEChain(flagDuplicates),
	RTEMap(NEAMap(unwrapEither)),
	RTChain((f) =>
		RTAsks((deps) =>
			pipe(
				f,
				EMap((f) => {
					deps.dispatch({
						type: 'FILES_SELECTED',
						payload: f,
					});
				}),
				EMapLeft((e) => {
					deps.dispatch({
						type: 'UPLOAD_COMPONENT_ERR',
						payload: e,
					});
					deps.authDispatch({
						type: 'ADD_APP_MESSAGE',
						payload: {
							messageKind: 'repeat',
							eventName: 'likely async failure',
							displayMessage: e.message,
							severity: 'warning',
							action: {
								kind: 'simple',
								handler: () =>
									deps.authDispatch({
										type: 'REMOVE_APP_MESSAGE',
									}),
							},
							timeout: 3000,
						},
					});
				})
			)
		)
	)
);
