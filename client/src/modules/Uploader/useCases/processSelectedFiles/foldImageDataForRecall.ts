import { IResizingData, IUploadableBlob } from '../../domain/domainTypes';
import { ICombinedUploadRequestMetadata } from '../../http/httpTypes';
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

const firstSG = getFirstSemigroup<string>();

const imgDataSG = getStructSemigroup<ICombinedUploadRequestMetadata>({
	ownerID: firstSG,
	displayName: firstSG,
	mediaType: firstSG,
	sizeInBytes: semigroupSum,
	integrityHash: NEASemigroup(),
	availableWidths: NEASemigroup(),
	publicPathPrefix: firstSG,
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
