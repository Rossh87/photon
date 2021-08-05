import {
    IImage,
    IImageWithErrors,
    TAllUploadedImages,
} from '../../domain/domainTypes';
import { Either, isRight, fold as EFold } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
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
