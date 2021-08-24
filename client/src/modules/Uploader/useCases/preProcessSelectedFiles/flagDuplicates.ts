import {
	IImage,
	IImageWithErrors,
	TAllUploadedImages,
} from '../../domain/domainTypes';
import {
	Either,
	fold as EFold,
	bimap,
} from 'fp-ts/lib/Either';
import { flow, pipe } from 'fp-ts/lib/function';
import { getDupeDisplayNames } from '../../http/getDupeDisplayNames';
import { fromArray, map as NEAMap } from 'fp-ts/lib/NonEmptyArray';
import { filter } from 'fp-ts/Array';
import {
	map as RTEMap,
	of as RTEOf,
	chain as RTEChain,
} from 'fp-ts/ReaderTaskEither';
import { fold as OFold } from 'fp-ts/Option';
import { TDedupeNamesResponse } from 'server/modules/Upload/sharedUploadTypes';

const fork = <T>(a: T) => [a, a] as const;

const assignUniquenessToImage =
	(isUnique: boolean) =>
	<A>(a: A) =>
		Object.assign(a, {
			isUniqueDisplayName: isUnique ? ('yes' as const) : ('no' as const),
		});

const setUniqueness = flow(assignUniquenessToImage, fork, (t) => bimap(...t));

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
				() => setUniqueness(true)(maybeDupe),
				() => setUniqueness(false)(maybeDupe)
			)
		);

const setNonUniqueNames =
	(submitted: TAllUploadedImages) =>
	(dupeInfo: TDedupeNamesResponse): TAllUploadedImages =>
		pipe(submitted, pipe(dupeInfo, searchDupes, NEAMap));

export const flagDuplicates = (as: TAllUploadedImages) =>
	pipe(
		as,
		RTEOf,
		RTEChain(getDupeDisplayNames),
		RTEMap(pipe(as, setNonUniqueNames))
	);
