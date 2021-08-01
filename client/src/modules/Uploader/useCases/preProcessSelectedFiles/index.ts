import {
	TPreprocessArgs,
	TNonEmptyPreprocessArgs,
} from '../../domain/domainTypes';
import { map as OMap } from 'fp-ts/lib/Option';
import { pipe, flow } from 'fp-ts/lib/function';
import {
	map as NEAmap,
} from 'fp-ts/lib/NonEmptyArray';
import { TUploaderActions } from '../../state/uploadStateTypes';
import { IO } from 'fp-ts/lib/IO';
import { IDependencies } from '../../../../core/dependencyContext';

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
