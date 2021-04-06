import { map } from 'fp-ts/lib/NonEmptyArray';
import { pipe } from 'fp-ts/lib/function';
import { IPreprocessedFile } from '../../../../core/imageReducer/preprocessImages/imagePreprocessingTypes';

// TODO: this is *potentially* fragile if we ever want to make updates to any native
// properties of the File object that our IPreprocessedFile extends, since some of
// these properties are readonly.  For now, we just add our own displayName prop
// as a workaround.
const maybeUpdate = (prevName: string, updates: Partial<IPreprocessedFile>) => (
	file: IPreprocessedFile
): IPreprocessedFile =>
	file.error
		? file
		: file.displayName === prevName
		? Object.assign(file, updates)
		: file;

export const updateOneFile = (
	prevName: string,
	updates: Partial<IPreprocessedFile>
) => pipe(maybeUpdate(prevName, updates), map);
