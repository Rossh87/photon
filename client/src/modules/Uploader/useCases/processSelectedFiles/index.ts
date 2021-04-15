import { processOneImage } from './processOneImage';
import { TPreprocessingResults } from '../../domain/domainTypes';
import { IDependencies } from '../../../../core/dependencyContext';
import { pipe } from 'fp-ts/lib/function';
import { TUploaderActions } from '../../state/uploadStateTypes';

// bite off one file at a time and fully process it to avoid
// pummelling the user's system
export const processSelectedFiles = (files: TPreprocessingResults) => (
	deps: IDependencies<TUploaderActions>
) => files.forEach(async (file) => await pipe(file, processOneImage)(deps)());
