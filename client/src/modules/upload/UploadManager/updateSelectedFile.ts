import { map, NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { UploadError } from './UploadError';
import { pipe } from 'fp-ts/lib/function';
import { getOrElse } from 'fp-ts/lib/Option';
import { IProcessedFile } from './uploadTypes';

// TODO: this is *potentially* fragile if we ever want to make updates to any native
// properties of the File object that our IProcessedFile extends, since some of
// these properties are readonly.  For now, we just add our own displayName prop
// as a workaround.
const maybeUpdate = (prevName: string, updates: Partial<IProcessedFile>) => (
	file: IProcessedFile
) => (file.displayName === prevName ? Object.assign(file, updates) : file);

export const updateOneFile = (
	prevName: string,
	updates: Partial<IProcessedFile>
) => pipe(maybeUpdate(prevName, updates), map);