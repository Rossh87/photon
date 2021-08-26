import { pipe, flow } from 'fp-ts/lib/function';
import { nanoid } from 'nanoid';
import { ISavedBreakpoint, TSavedBreakpoints } from 'sharedTypes/Breakpoint';
import { map as ArrMap, sort, concatW } from 'fp-ts/Array';
import { TAvailableImageWidths } from 'sharedTypes/Upload';
import { Ord as NumOrd } from 'fp-ts/number';
import { fromPredicate, map as OMap, getOrElseW } from 'fp-ts/Option';
import {
	IBreakpointUI,
	ILocalBreakpointUI,
	TDefaultBreakpointUI,
	TNewBreakpointUI,
	TUIBreakpoints,
	TUserBreakpointUI,
} from '../state/imageDialogState';
import { makeDefaultUIBreakpoints } from '../helpers/makeDefaultUIBreakpoints';

// NB that the following functions can accept *either* ISavedBreakpoint or TBreakpointUI, since the latter
// extends the former.
type TSrcsetCreationType = 'element' | 'string';

const makeSrcset =
	(widths: TAvailableImageWidths) =>
	(publicPath: string): string =>
		widths.reduce(
			(str, w, i, a) =>
				str +
				`${publicPath}/${w} ${w}w` +
				(i === a.length - 1 ? '' : ', '),
			''
		);

export const sizeFromBreakpoint = ({
	slotWidth,
	queryType,
	slotUnit,
	mediaWidth,
}: ISavedBreakpoint | Omit<ISavedBreakpoint, '_id'> | ILocalBreakpointUI) =>
	`(${queryType}-width: ${mediaWidth}px) ${slotWidth}${slotUnit}`;

const sizesFromBreakpoints = (bps: TSavedBreakpoints): string =>
	bps.reduce(
		(str, bp, i, a) =>
			str + sizeFromBreakpoint(bp) + (i === a.length - 1 ? '' : ', '),
		''
	);

// all user-defined breakpoints FIRST, then default breakpoints
export const mergeBreakpoints =
	(ubp: TUserBreakpointUI[]) =>
	(dbp: TDefaultBreakpointUI[]): TUIBreakpoints =>
		concatW(dbp)(ubp);

// TODO: need to get a flow set up for adding alt text to images
const HTMLStringFromBreakpoints =
	(availableWidths: TAvailableImageWidths) =>
	(publicPath: string) =>
	(bps: TSavedBreakpoints): string =>
		`<img srcset="${makeSrcset(availableWidths)(
			publicPath
		)}" sizes="${sizesFromBreakpoints(bps)}" src="${publicPath}/${
			availableWidths[availableWidths.length - 1]
		}" alt="">`;

const JSXElementFromBreakpoints =
	(availableWidths: TAvailableImageWidths) =>
	(publicPath: string) =>
	(bps: TSavedBreakpoints) =>
		(
			<img
				srcSet={makeSrcset(availableWidths)(publicPath)}
				sizes={sizesFromBreakpoints(bps)}
				src={`${publicPath}/${
					availableWidths[availableWidths.length - 1]
				}`}
				style={{ maxWidth: '100%' }}
				alt=""
			></img>
		);

/**Ordering of sizes:
 * First, build size-matchers for all user-defined breakpoints, in the order in which they were set.
 * Second, build size-matchers for all default breakpoints (derived from available widths), ordered from
 * SMALLEST "max-width" to LARGEST "max-width".  We want to match smaller screens (and load smaller image) FIRST.
 */

// TODO: this should just accept an IDBUpload
export const createSrcset =
	(creationType: TSrcsetCreationType) =>
	(userBreakpoints: TUserBreakpointUI[]) =>
	(availableWidths: TAvailableImageWidths) =>
	(publicPath: string) =>
		pipe(
			availableWidths,
			makeDefaultUIBreakpoints,
			pipe(userBreakpoints, mergeBreakpoints),
			(x) =>
				pipe(
					creationType,
					fromPredicate((y) => y === 'element'),
					OMap(() =>
						pipe(
							x,
							JSXElementFromBreakpoints(availableWidths)(
								publicPath
							)
						)
					),
					getOrElseW(() =>
						pipe(
							x,
							HTMLStringFromBreakpoints(availableWidths)(
								publicPath
							)
						)
					)
				)
		);
