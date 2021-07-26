import {
	TPreprocessArgs,
	IImage,
	TNonEmptyPreprocessArgs,
} from '../../domain/domainTypes';
import { Either, right, left, fold as Efold } from 'fp-ts/lib/Either';
import { map as OMap, Option } from 'fp-ts/lib/Option';
import { pipe, flow } from 'fp-ts/lib/function';
import { MAX_RAW_FILE_SIZE_IN_BYTES } from '../../../../CONSTANTS';
import {
	map as NEAmap,
	fromArray as NEAFromArray,
} from 'fp-ts/lib/NonEmptyArray';
import { ImagePreprocessError } from '../../domain/ImagePreprocessError';
import { TUploaderActions } from '../../state/uploadStateTypes';
import { IO } from 'fp-ts/lib/IO';
import { IDependencies } from '../../../../core/dependencyContext';
import { getDupeDisplayNames } from '../../http/getDupeDisplayNames';

const preprocessOneFile = (ownerID: string) =>
	flow(appendMetadataToFile(ownerID), validateFileSize);

export const processAndValidateFiles = ([
	files,
	ownerID,
]: TNonEmptyPreprocessArgs) => pipe(files, NEAmap(preprocessOneFile(ownerID)));

export const preprocessImages =
	(fileData: TPreprocessArgs) =>
	(deps: IDependencies<TUploaderActions>): IO<void> =>
	() =>
		pipe(
			fileData,
			fileListToNonEmptyArray,
			OMap(processAndValidateFiles),
			OMap(foldToResult),
			OMap((preprocessedFiles) =>
				deps.dispatch({
					type: 'FILES_SELECTED',
					payload: preprocessedFiles,
				})
			)
		);
