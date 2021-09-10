import { IDBUpload } from '../../../sharedTypes/Upload';
import { TDBUser } from '../../../sharedTypes/User';
import { map } from 'fp-ts/Array';
import { pipe } from 'fp-ts/lib/function';

export const gcsFileNamesFromUpload = (upload: IDBUpload) => {
	const { ownerID, displayName, availableWidths } = upload;

	const getNameFromWidth = (width: number) =>
		`${ownerID}/${displayName}/${width.toString()}`;

	return pipe(availableWidths, map(getNameFromWidth));
};
