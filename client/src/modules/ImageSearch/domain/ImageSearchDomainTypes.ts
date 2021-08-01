import { ICombinedUploadRequestMetadata } from '../../Uploader/http/httpTypes';
import { TWithId } from '../../../core/sharedTypes';

export type TFetchedImageData = TWithId<ICombinedUploadRequestMetadata>;

// re-export this type from Uploader component, since it will be crucial for search
// page too, and we would never want to make a new, identical type and have it get out-of-sync
export type { ICombinedUploadRequestMetadata } from '../../Uploader/http/httpTypes';
