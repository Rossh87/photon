import { processOneImage } from './processOneImage';
import { TSelectedFilesState } from '../../state/uploadStateTypes';
import { IDependencies } from '../../../../core/dependencyContext';
import { pipe } from 'fp-ts/lib/function';
import { TUploaderActions } from '../../state/uploadStateTypes';
import { sequenceArray } from 'fp-ts/lib/ReaderTask';
import { map as NEAMap, fromArray } from 'fp-ts/lib/NonEmptyArray';
import { map as OMap, getOrElseW } from 'fp-ts/lib/Option';
import { ReaderTask } from 'fp-ts/lib/ReaderTask';
import { fromIO } from 'fp-ts/lib/Task';
import { BaseError } from '../../../../core/error';

type T = ReaderTask<IDependencies<TUploaderActions>, void>;

// bite off one file at a time and fully process it to avoid
// pummelling the user's system
export const processSelectedFiles = (files: TSelectedFilesState) =>
    pipe(
        files,
        fromArray,
        OMap(NEAMap(processOneImage)),
        OMap(sequenceArray),
        getOrElseW<T>(
            () => (deps: IDependencies<TUploaderActions>) =>
                fromIO(() =>
                    deps.dispatch({
                        type: 'UPLOAD_COMPONENT_ERR',
                        payload: new BaseError(
                            'Please select files to upload before submission'
                        ),
                    })
                )
        )
    );
