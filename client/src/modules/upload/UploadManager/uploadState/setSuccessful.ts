import { map as NEAMap } from 'fp-ts/lib/NonEmptyArray';
import { flow } from 'fp-ts/lib/function';
import { IPreprocessedFile } from '../../../../core/imageReducer/preprocessImages/imagePreprocessingTypes';

export const setSuccessful = (successfulUpload: string) =>
	flow(
		NEAMap<IPreprocessedFile, IPreprocessedFile>((f) =>
			f.displayName === successfulUpload
				? Object.assign(f, { status: 'success' })
				: f
		)
	);
