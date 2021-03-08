import {
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
import { _processUploadInitSuccess } from './processUploadInitSuccess';
import {
	_requestResumableUpload,
	ResumableUploadCreationErr,
} from './requestResumableUpload';
import { IUploadResponseMetadata } from '../sharedUploadTypes';

const failedUploadInitSG = getNEASemigroup<ResumableUploadCreationErr>();
const uploadInitSuccessSG = getNEASemigroup<IUploadResponseMetadata>();

const uploadResultSG = getTheseSemigroup(
	failedUploadInitSG,
	uploadInitSuccessSG
);

const eitherToThese = (
	e: Either<ResumableUploadCreationErr, IUploadResponseMetadata>
) =>
	isLeft(e)
		? Tleft([e.left] as NonEmptyArray<ResumableUploadCreationErr>)
		: Tright([e.right] as NonEmptyArray<IUploadResponseMetadata>);

export const collateUploadInitResults = foldMap(uploadResultSG)(eitherToThese);
