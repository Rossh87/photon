import { IImage, IImageWithErrors } from '../../domain/domainTypes';
import {
	Either,
	right,
	left,
	isRight,
	fold,
	map as EMap,
} from 'fp-ts/lib/Either';
import { pipe, flow } from 'fp-ts/lib/function';
import { MAX_RAW_FILE_SIZE_IN_BYTES } from '../../../../CONSTANTS';
import { ImagePreprocessError } from '../../domain/ImagePreprocessError';
import { getDupeDisplayNames } from '../../http/getDupeDisplayNames';
import { NonEmptyArray, fromArray, foldMap } from 'fp-ts/lib/NonEmptyArray';
import { getMonoid as getArrayMonoid, of as ArrayOf } from 'fp-ts/Array';
import { asks, chain as RTEChain, map as RTEMap } from 'fp-ts/ReaderTaskEither';
import {
	map as OMap,
	Applicative as OApplicative,
	fromEither,
	getOrElseW,
} from 'fp-ts/Option';
import { getApplicativeMonoid } from 'fp-ts/Applicative';

const m = getApplicativeMonoid(OApplicative)(getArrayMonoid<IImage>());

const toOpt = (a: Either<IImageWithErrors, IImage>) =>
	pipe(a, fromEither, OMap(ArrayOf));

const addNonUniqueNameErrs;

export const deduplicate = flow(
	foldMap(m)(toOpt),
	getOrElseW(() => []),
	getDupeDisplayNames,
	RTEMap(flow(fromArray, OMap))
);
