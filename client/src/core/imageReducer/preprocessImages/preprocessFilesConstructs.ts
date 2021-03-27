import {
	These,
	getSemigroup as getTheseSemigroup,
	left as Tleft,
	right as Tright,
} from 'fp-ts/lib/These';
import {
	NonEmptyArray,
	getSemigroup as getNEASemigroup,
	foldMap,
} from 'fp-ts/lib/NonEmptyArray';
import { Either, isLeft } from 'fp-ts/lib/Either';
import { ImagePreprocessError } from './ImagePreprocessError';
import { IPreprocessedFile } from './imagePreprocessingTypes';

const preprocessErrSG = getNEASemigroup<ImagePreprocessError>();
const preprocessSuccessSG = getNEASemigroup<IPreprocessedFile>();

export const preprocessResultSG = getTheseSemigroup(
	preprocessErrSG,
	preprocessSuccessSG
);

const eitherToThese = (e: Either<ImagePreprocessError, IPreprocessedFile>) =>
	isLeft(e)
		? Tleft([e.left] as NonEmptyArray<ImagePreprocessError>)
		: Tright([e.right] as NonEmptyArray<IPreprocessedFile>);

export const collatePreprocessResults = foldMap(preprocessResultSG)(
	eitherToThese
);
