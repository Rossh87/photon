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
import { Either, isLeft } from 'fp-ts/lib/Either';
import { _processUploadInitSuccess } from './processUploadInitSuccess';
import {
	_requestResumableUpload,
	ResumableUploadCreationErr,
} from './requestResumableUpload';
import {
	IUploadResponseMetadata,
	IUploadsResponsePayload,
} from '../sharedUploadTypes';
import { flow } from 'fp-ts/lib/function';

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

const eithersToThese = foldMap(uploadResultSG)(eitherToThese);

const onErrsOnly = (
	es: NonEmptyArray<ResumableUploadCreationErr>
): IUploadsResponsePayload => ({ failures: es });

const onSuccessOnly = (
	as: NonEmptyArray<IUploadResponseMetadata>
): IUploadsResponsePayload => ({ successes: as });

const onMixed = (
	es: NonEmptyArray<ResumableUploadCreationErr>,
	as: NonEmptyArray<IUploadResponseMetadata>
): IUploadsResponsePayload => ({ successes: as, failures: es });

export const toResponsePayload = flow(
	eithersToThese,
	Thfold(onErrsOnly, onSuccessOnly, onMixed)
);
