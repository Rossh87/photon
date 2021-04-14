import { processOneImage } from './processOneImage';
import { TPreprocessingResults } from '../../../../core/imageReducer/preprocessImages/imagePreprocessingTypes';
import { IDependencies } from '../../../../core/sharedTypes';
import { map as NEAMap } from 'fp-ts/lib/NonEmptyArray';
import { pipe, flow } from 'fp-ts/lib/function';
import { sequenceArray } from 'fp-ts/lib/ReaderTaskEither';

// bite off one file at a time and fully process it to avoid
// pummelling the user's system
export const processAllImages = (files: TPreprocessingResults) => (
	deps: IDependencies
) => files.forEach(async (file) => await pipe(file, processOneImage)(deps)());
