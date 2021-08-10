import { TAvailableImageWidths, IDBUpload } from './Upload';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';

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

// type guards
import { Refinement } from 'fp-ts/Refinement';

export const isUserBreakpoint: Refinement<IBreakpoint, TUserBreakpoint> =
    function (b): b is TUserBreakpoint {
        return b.origin === 'user';
    };

export const isDefaultBreakpoint: Refinement<IBreakpoint, TDefaultBreakpoint> =
    function (b): b is TDefaultBreakpoint {
        return b.origin === 'default';
    };
