import { ICombinedUploadRequestMetadata } from '../../Uploader/http/httpTypes';
import { TWithId } from '../../../core/sharedTypes';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';

export type TFetchedImageData = TWithId<ICombinedUploadRequestMetadata>;

export type TAvailableImageWidths = NonEmptyArray<number>;

// re-export this type from Uploader component, since it will be crucial for search
// page too, and we would never want to make a new, identical type and have it get out-of-sync
export type { ICombinedUploadRequestMetadata } from '../../Uploader/http/httpTypes';

export type TBreakpointWidthType = 'max' | 'min';

export type TBreakpointSlotUnit = 'vw' | 'px' | 'em';

export type TBreakpointOrigin = 'user' | 'default';

export interface IBreakpoint extends Record<string, any> {
    type: TBreakpointWidthType;
    mediaWidth: number;
    slotWidth: number;
    slotUnit: TBreakpointSlotUnit;
    origin: TBreakpointOrigin;
}

export type TUserBreakpoint = IBreakpoint & { origin: 'user' };

export type TDefaultBreakpoint = IBreakpoint & { origin: 'default' };

export type TBreakpoints = Array<IBreakpoint>;

export type TUserBreakpoints = Array<TUserBreakpoint>;

export type TDefaultBreakpoints = Array<TDefaultBreakpoint>;
