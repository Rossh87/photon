import { IResizingData, IUploadableBlob } from '../../domain/domainTypes';
import { ICombinedUploadRequestMetadata } from 'sharedTypes/Upload';
import {
    foldMap,
    getSemigroup as NEASemigroup,
    of as NEAOf,
} from 'fp-ts/lib/NonEmptyArray';
import { pipe } from 'fp-ts/lib/function';
import {
    getStructSemigroup,
    getFirstSemigroup,
    semigroupSum,
} from 'fp-ts/lib/Semigroup';
import { constructPublicBasePath } from '../../../../core/constructPublicBasePath';
import { TMediaType } from 'sharedTypes/Upload';

const mediaSG = getFirstSemigroup<TMediaType>();
const stringFirstSG = getFirstSemigroup<string>();
const widthsSG = NEASemigroup<number>();
const hashSG = NEASemigroup<string>();

const imgDataSG = getStructSemigroup<ICombinedUploadRequestMetadata>({
    ownerID: stringFirstSG,
    displayName: stringFirstSG,
    mediaType: mediaSG,
    sizeInBytes: semigroupSum,
    integrityHash: hashSG,
    availableWidths: widthsSG,
    publicPathPrefix: stringFirstSG,
});

const toFoldableMetaData = (a: IUploadableBlob) =>
    pipe(
        a,
        (y) => y.metaData,
        (md) =>
            Object.assign({}, md, {
                integrityHash: NEAOf(md.integrityHash),
                availableWidths: NEAOf(md.width),
                publicPathPrefix: constructPublicBasePath(a),
            })
    );

export const foldImageDataForRecall = (imgData: IResizingData) =>
    pipe(imgData.resizedBlobs, foldMap(imgDataSG)(toFoldableMetaData));
