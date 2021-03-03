import { TFileActions, IImageUploadState } from './uploadTypes';
import { NonEmptyArray, copy } from 'fp-ts/lib/NonEmptyArray';
import React from 'react';

export const uploadReducer: React.Reducer<IImageUploadState, TFileActions> = (
    s,
    a
) => {
    switch (a.type) {
        case 'FILES_SELECTED':
            return { ...s, selectedFiles: a.data };
        case 'INVALID_FILE_SELECTION':
            return {
                ...s,
                selectedFiles: [],
                errors: copy(a.data),
            };
        default:
            return s;
    }
};
