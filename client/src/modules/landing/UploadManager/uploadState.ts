import { TFileActions, IImageUploadState } from './uploadTypes';
import React from 'react';
import {preProcessFileItem} from './preProcessFileItem';

export const uploadReducer: React.Reducer<IImageUploadState, TFileActions> = (s, a) => {
    switch(a.type) {
        case 'FILES_SELECTED':
            return {...s, rawFiles: a.data, processedFiles: a.data.}
    }
}
