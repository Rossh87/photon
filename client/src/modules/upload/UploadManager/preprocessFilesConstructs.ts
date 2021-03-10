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
import { UploadError } from './UploadError';
import { IPreprocessedFile } from './uploadTypes';

const preprocessErrSG = getNEASemigroup<UploadError>();
const preprocessSuccessSG = getNEASemigroup<IPreprocessedFile>();

export const preprocessResultSG = getTheseSemigroup(
	preprocessErrSG,
	preprocessSuccessSG
);

const eitherToThese = (e: Either<UploadError, IPreprocessedFile>) =>
	isLeft(e)
		? Tleft([e.left] as NonEmptyArray<UploadError>)
		: Tright([e.right] as NonEmptyArray<IPreprocessedFile>);

export const collatePreprocessResults = foldMap(preprocessResultSG)(
	eitherToThese
);
