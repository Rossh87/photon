import { IImage } from '../../domain/domainTypes';

export const bytesToHumanReadableSize = (byteCount: number): string =>
	byteCount < 1024
		? byteCount + 'bytes'
		: byteCount >= 1024 && byteCount < 1048576
		? (byteCount / 1024).toFixed(1) + 'KB'
		: (byteCount / 1048576).toFixed(1) + 'MB';

export const appendMetadataToFile =
	(ownerID: string) =>
	(file: File): IImage =>
		Object.assign<
			File,
			Pick<
				IImage,
				| 'ownerID'
				| 'humanReadableSize'
				| 'displayName'
				| 'originalSizeInBytes'
				| 'status'
				| 'isUniqueDisplayName'
			>
		>(file, {
			ownerID: ownerID,
			humanReadableSize: bytesToHumanReadableSize(file.size),
			displayName: file.name.trim(),
			originalSizeInBytes: file.size,
			status: 'preprocessed',
			isUniqueDisplayName: 'pending',
		});
