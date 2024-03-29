import { pipe } from 'fp-ts/lib/function';
import { ISavedBreakpoint, TSavedBreakpoints } from 'sharedTypes/Breakpoint';
import { concatW } from 'fp-ts/Array';
import { TAvailableImageWidths } from 'sharedTypes/Upload';
import { map as OMap, fromPredicate, getOrElseW } from 'fp-ts/Option';


import { makeDefaultBreakpoints } from '../helpers/makeDefaultUIBreakpoints';

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
}: ISavedBreakpoint) =>
	`(${queryType}-width: ${mediaWidth}px) ${slotWidth}${slotUnit}`;

const sizesFromBreakpoints = (bps: TSavedBreakpoints): string =>
	bps.reduce(
		(str, bp, i, a) =>
			str + sizeFromBreakpoint(bp) + (i === a.length - 1 ? '' : ', '),
		''
	);

// all user-defined breakpoints FIRST, then default breakpoints
export const mergeBreakpoints =
	(userDefinedBreakpoints: TSavedBreakpoints) =>
	(defaultBreakpoints: TSavedBreakpoints): TSavedBreakpoints =>
		concatW(defaultBreakpoints)(userDefinedBreakpoints);

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

// TODO: this should just accept an IClientUpload
export const createSrcset =
	(creationType: TSrcsetCreationType) =>
	(userBreakpoints: TSavedBreakpoints) =>
	(availableWidths: TAvailableImageWidths) =>
	(publicPath: string) =>
		pipe(
			availableWidths,
			makeDefaultBreakpoints,
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
