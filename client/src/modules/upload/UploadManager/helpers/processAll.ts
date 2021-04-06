import { processOneImage } from './processOneImage';
import { TPreprocessingResults } from '../../../../core/imageReducer/preprocessImages/imagePreprocessingTypes';
import { IAsyncDependencies } from '../../../../core/sharedTypes';
import { map as NEAMap } from 'fp-ts/lib/NonEmptyArray';
import { pipe, flow } from 'fp-ts/lib/function';
import { sequenceArray } from 'fp-ts/lib/ReaderTaskEither';

export const processAll = flow(NEAMap(processOneImage));
