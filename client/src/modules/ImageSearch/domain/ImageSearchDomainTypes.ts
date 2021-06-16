import { ReducerAction } from 'react';
import { ICombinedUploadRequestMetadata } from '../../Uploader/http/httpTypes';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { BaseError } from '../../../core/error';
import { TWithId } from '../../../core/sharedTypes';

export type TFetchedImageData = TWithId<ICombinedUploadRequestMetadata>;

// re-export this type from Uploader component, since it will be crucial for search
// page too, and we would never want to make a new, identical type and have it get out-of-sync
export type { ICombinedUploadRequestMetadata } from '../../Uploader/http/httpTypes';
