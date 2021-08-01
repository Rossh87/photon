import {
	IImage,
	IImageWithErrors,
	TAllUploadedImages,
} from '../../domain/domainTypes';
import {
	Either,
	right,
	left,
	isRight,
	fold as EFold,
	map as EMap,
} from 'fp-ts/lib/Either';
import { pipe, flow } from 'fp-ts/lib/function';
import { MAX_RAW_FILE_SIZE_IN_BYTES } from '../../../../CONSTANTS';
import { ImagePreprocessError } from '../../domain/ImagePreprocessError';
import { getDupeDisplayNames } from '../../http/getDupeDisplayNames';
import {
	NonEmptyArray,
	fromArray,
	foldMap,
	map as NEAMap,
} from 'fp-ts/lib/NonEmptyArray';
import {
	getMonoid as getArrayMonoid,
	of as ArrayOf,
	map as ArrMap,
	filter,
} from 'fp-ts/Array';
import {
	asks,
	chain as RTEChain,
	map as RTEMap,
	bind as RTEBind,
	bindTo as RTEBindTo,
	of as RTEOf,
	ReaderTaskEither,
} from 'fp-ts/ReaderTaskEither';
import {
	map as OMap,
	fold as OFold,
	Applicative as OApplicative,
	fromEither,
	getOrElseW,
	fromPredicate,
} from 'fp-ts/Option';
import { IDependencies } from '../../../../core/dependencyContext';
import { TUploaderActions } from '../../state/uploadStateTypes';
import {
	TDedupeNamesResponse,
	IDedupeMetadata,
} from 'server/modules/Upload/sharedUploadTypes';
import { BaseError } from '../../../../core/error';

const setUniqueness =
	(maybeDupe: Either<IImageWithErrors, IImage>) => (isUnique: boolean) =>
		isRight(maybeDupe)
			? Object.assign(maybeDupe, {
					right: {
						...maybeDupe.right,
						isUniqueDisplayName: isUnique ? 'yes' : 'no',
					},
			  })
			: Object.assign(maybeDupe, {
					left: {
						...maybeDupe.left,
						isUniqueDisplayName: isUnique ? 'yes' : 'no',
					},
			  });

const searchDupes =
	(dupes: TDedupeNamesResponse) =>
	(
		maybeDupe: Either<IImageWithErrors, IImage>
	): Either<IImageWithErrors, IImage> =>
		pipe(
			maybeDupe,
			EFold(
				(e) => e.displayName,
				(a) => a.displayName
			),
			(dn) =>
				pipe(
					dupes,
					filter((x) => x.displayName === dn)
				),
			fromArray,
			OFold(
				() => setUniqueness(maybeDupe)(true),
				() => setUniqueness(maybeDupe)(false)
			)
		);

const setNonUniqueNames =
	(dupeInfo: TDedupeNamesResponse) =>
	(submitted: TAllUploadedImages): TAllUploadedImages =>
		pipe(submitted, NEAMap(flow(pipe(dupeInfo, searchDupes))));

export const deduplicate: (
	as: TAllUploadedImages
) => ReaderTaskEither<
	IDependencies<TUploaderActions>,
	BaseError,
	TAllUploadedImages
> = flow(
	RTEOf,
	RTEBindTo('submitted'),
	RTEBind('dupes', (x) => getDupeDisplayNames(x.submitted)),
	RTEMap((x) => setNonUniqueNames(x.dupes)(x.submitted))
);
