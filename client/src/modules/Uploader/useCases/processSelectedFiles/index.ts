import { processOneImage } from './processOneImage';
import { TSelectedFilesState } from '../../state/uploadStateTypes';
import { IDependencies } from '../../../../core/dependencyContext';
import { pipe } from 'fp-ts/lib/function';
import { TUploaderActions } from '../../state/uploadStateTypes';
import { sequenceArray } from 'fp-ts/lib/ReaderTask';
import { map as NEAMap, fromArray } from 'fp-ts/lib/NonEmptyArray';
import { map as OMap, getOrElse } from 'fp-ts/lib/Option';

// bite off one file at a time and fully process it to avoid
// pummelling the user's system
export const processSelectedFiles = (files: TSelectedFilesState) => (
	deps: IDependencies<TUploaderActions>
) =>
	pipe(
		files,
		fromArray,
		OMap(NEAMap(processOneImage)),
		OMap(sequenceArray),
		getOrElse(
			deps.dispatch({
				type: 'UPLOAD_COMPONENT_ERR',
				data: 'Please select files to upload before submission',
			})
		)
	);
