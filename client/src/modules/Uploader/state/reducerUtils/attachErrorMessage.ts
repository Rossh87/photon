import { map } from 'fp-ts/lib/NonEmptyArray';
import { pipe } from 'fp-ts/lib/function';
import { TPreprocessingResults } from '../../domain/domainTypes';
import { IUploadFailureData } from '../uploadStateTypes';

export const attachErrorMessage = (failureData: IUploadFailureData) => (
	imageFiles: TPreprocessingResults
) =>
	pipe(
		imageFiles,
		map((f) =>
			f.displayName === failureData.failedFileDisplayName
				? Object.assign(f, { error: failureData.err, status: 'error' })
				: f
		)
	);
