import { processOneImage } from './processOneImage';
import { TSelectedFilesState } from '../../state/uploadStateTypes';
import { IDependencies } from '../../../../core/dependencyContext';
import { pipe } from 'fp-ts/lib/function';
import { map as NEAMap, fromArray } from 'fp-ts/lib/NonEmptyArray';
import { map as OMap, getOrElseW } from 'fp-ts/lib/Option';
import { fromIO } from 'fp-ts/lib/Task';
import { BaseError } from '../../../../core/error';
import {
	chain as RTEChain,
	sequenceArray as RTESequence,
	asks,
} from 'fp-ts/ReaderTaskEither';
import { TAppAction } from '../../../appState/appStateTypes';
import { ICombinedUploadRequestMetadata } from '../../../../../../sharedTypes/Upload';
import { IAddUploadDataAction } from '../../../Auth/state/authStateTypes';

const imageMetadataUpdatePayload = (
	md: readonly ICombinedUploadRequestMetadata[]
): IAddUploadDataAction => ({
	type: 'AUTH/ADD_UPLOAD_DATA',
	payload: {
		fileCount: md.length,
		combinedSize: md.reduce((sum, el) => (sum += el.sizeInBytes), 0),
	},
});

// bite off one file at a time and fully process it to avoid
// pummelling the user's system
export const processSelectedFiles = (files: TSelectedFilesState) =>
	pipe(
		files,
		fromArray,
		OMap(NEAMap(processOneImage)),
		OMap(RTESequence),
		OMap(
			RTEChain((imageMetadata) =>
				asks((d) =>
					pipe(imageMetadata, imageMetadataUpdatePayload, d.dispatch)
				)
			)
		),
		getOrElseW(
			() => (deps: IDependencies<TAppAction>) =>
				fromIO(() =>
					deps.dispatch({
						type: 'UPLOADER/UPLOAD_COMPONENT_ERR',
						payload: new BaseError(
							'Please select files to upload before submission'
						),
					})
				)
		)
	);
