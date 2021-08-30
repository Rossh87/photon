import {
	getSemigroup as getTheseSemigroup,
	left as Tleft,
	right as Tright,
	fold as Thfold,
} from 'fp-ts/lib/These';
import {
	NonEmptyArray,
	getSemigroup as getNEASemigroup,
	foldMap,
} from 'fp-ts/lib/NonEmptyArray';
import { Either, isLeft, right } from 'fp-ts/lib/Either';
import { _processUploadInitSuccess } from './processUploadInitSuccess';
import {
	_requestResumableUpload,
	ResumableUploadCreationErr,
} from './requestResumableUpload';
import {
	IUploadURIMetadata,
	IUploadsResponsePayload,
} from 'sharedTypes/Upload';
import { flow } from 'fp-ts/lib/function';

const failedUploadInitSG = getNEASemigroup<ResumableUploadCreationErr>();
const uploadInitSuccessSG = getNEASemigroup<IUploadURIMetadata>();

const uploadResultSG = getTheseSemigroup(
	failedUploadInitSG,
	uploadInitSuccessSG
);

const eitherToThese = (
	e: Either<ResumableUploadCreationErr, IUploadURIMetadata>
) =>
	isLeft(e)
		? Tleft([e.left] as NonEmptyArray<ResumableUploadCreationErr>)
		: Tright([e.right] as NonEmptyArray<IUploadURIMetadata>);

const eithersToThese = foldMap(uploadResultSG)(eitherToThese);

const onErrsOnly = (
	es: NonEmptyArray<ResumableUploadCreationErr>
): IUploadsResponsePayload => ({ failures: es });

const onSuccessOnly = (
	as: NonEmptyArray<IUploadURIMetadata>
): IUploadsResponsePayload => ({ successes: as });

const onMixed = (
	es: NonEmptyArray<ResumableUploadCreationErr>,
	as: NonEmptyArray<IUploadURIMetadata>
): IUploadsResponsePayload => ({ successes: as, failures: es });

// Note that we re-wrap this in a 'Right' for compatibility with the
// control flow in the controller
export const toResponsePayload = flow(
	eithersToThese,
	Thfold(onErrsOnly, onSuccessOnly, onMixed),
	right
);
