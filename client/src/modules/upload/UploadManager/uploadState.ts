import {
    TFileActions,
    IImageUploadState,
    TPreprocessedFiles,
    TPreprocessErrors,
} from './uploadTypes';
import { copy } from 'fp-ts/lib/NonEmptyArray';
import React from 'react';
import { filterOneError, filterOneFile } from './filterFiles';

export const uploadReducer: React.Reducer<IImageUploadState, TFileActions> = (
    s,
    a
) => {
    switch (a.type) {
        case 'FILES_SELECTED':
            return { ...s, selectedFiles: a.data };
        case 'INVALID_FILE_SELECTIONS':
            return {
                ...s,
                errors: copy(a.data),
            };
        case 'UNSELECT_INVALID_FILE':
            return {
                ...s,
                errors: filterOneError(a.data)(s.errors as TPreprocessErrors),
            };
        case 'UNSELECT_VALID_FILE':
            return {
                ...s,
                selectedFiles: filterOneFile(a.data)(
                    s.selectedFiles as TPreprocessedFiles
                ),
            };
        default:
            return s;
    }
};
