import { TAvailableImageWidths, IDBUpload } from './Upload';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';

export type TBreakpointQueryType = 'max' | 'min';

export type TSavedBreakpointslotUnit = 'vw' | 'px' | 'em';

export interface ISavedBreakpoint {
	queryType: TBreakpointQueryType;
	mediaWidth: number;
	slotWidth: number;
	slotUnit: TSavedBreakpointslotUnit;
	_id: string;
}

export type TSavedBreakpoints = Array<ISavedBreakpoint>;
