

import { pipe } from 'fp-ts/lib/function';
import { TUploaderActions } from '../state/uploadStateTypes';

import { tryCatch } from 'fp-ts/TaskEither';
import {
    IDependencies,
    IHttpCall,
    extractResponseData,
} from '../../../core/dependencyContext';
import {
    TDedupeNamesPayload,
    TDedupeNamesResponse,
} from 'server/modules/Upload/sharedUploadTypes';
import { DEDUPLICATION_ENDPOINT } from './endpoints';
import { BaseError } from '../../../core/error';

// TODO: this code would ideally be merged with ./getDupeDisplayNames.ts
const toPayload: (newName: string) => TDedupeNamesPayload = (n) => ({
    displayNames: [n],
});

const requestDupes =
    (potentialDupes: TDedupeNamesPayload): IHttpCall<TDedupeNamesResponse> =>
    (httpLib) =>
        httpLib.post(DEDUPLICATION_ENDPOINT, potentialDupes);

export const checkOneDupeDisplayName =
    (newName: string) => (deps: IDependencies<TUploaderActions>) =>
        tryCatch(
            () =>
                pipe(
                    pipe(newName, toPayload, requestDupes),
                    deps.http,
                    extractResponseData
                ),
            (e) =>
                new BaseError(
                    'Attempt to request duplicate displayNames from server failed.',
                    e
                )
        );
