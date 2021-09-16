import { processOneImage } from './processOneImage';
import { TSelectedFilesState } from '../../state/uploadStateTypes';
import { IDependencies } from '../../../../core/dependencyContext';
import { pipe } from 'fp-ts/lib/function';
import { map as NEAMap, fromArray } from 'fp-ts/lib/NonEmptyArray';
import { map as OMap, getOrElseW } from 'fp-ts/lib/Option';
import { fromIO } from 'fp-ts/lib/Task';
import { BaseError } from '../../../../core/error';
import {
	asks,
	chain as RTEChain,
	sequenceArray as RTESequence,
} from 'fp-ts/ReaderTaskEither';
import { TAppAction } from '../../../appState/appStateTypes';

// bite off one file at a time and fully process it to avoid
// pummelling the user's system
export const processSelectedFiles = (files: TSelectedFilesState) =>
	pipe(
		files,
		fromArray,
		OMap(NEAMap(processOneImage)),
		OMap(RTESequence),
		OMap(
			RTEChain(() =>
				asks((d) =>
					d.dispatch({
						type: 'AUTH/INCREASE_IMAGE_COUNT',
						payload: files.length,
					})
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
