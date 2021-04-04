import { map } from 'fp-ts/lib/NonEmptyArray';
import { pipe } from 'fp-ts/lib/function';
import {
	IPreprocessedFile,
	IPreprocessingResult,
} from '../../../../core/imageReducer/preprocessImages/imagePreprocessingTypes';

// TODO: this is *potentially* fragile if we ever want to make updates to any native
// properties of the File object that our IPreprocessedFile extends, since some of
// these properties are readonly.  For now, we just add our own displayName prop
// as a workaround.
const maybeUpdate = (prevName: string, updates: Partial<IPreprocessedFile>) => (
	file: IPreprocessingResult
): IPreprocessingResult =>
	file.error
		? file
		: file.imageFile.displayName === prevName
		? Object.assign(
				{},
				{ imageFile: Object.assign(file.imageFile, updates) }
		  )
		: file;

export const updateOneFile = (
	prevName: string,
	updates: Partial<IPreprocessedFile>
) => pipe(maybeUpdate(prevName, updates), map);
