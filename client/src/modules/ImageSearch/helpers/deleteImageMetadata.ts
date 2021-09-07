import { IClientUpload, TUploadDeletionID } from 'sharedTypes/Upload';
import { filter } from 'fp-ts/Array';
import { pipe } from 'fp-ts/lib/function';

export const deleteImageMetadata =
	(imageToDelete: TUploadDeletionID) => (images: IClientUpload[]) =>
		pipe(
			images,
			filter((img) => img._id !== imageToDelete)
		);
