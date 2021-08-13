import { pipe, flow } from 'fp-ts/lib/function';
import {
	TUserBreakpoints,
	TDefaultBreakpoints,
	IBreakpoint,
	TBreakpoints,
	TDefaultBreakpoint,
} from 'sharedTypes/Breakpoint';
import { map as ArrMap, sort, concatW } from 'fp-ts/Array';
import { TAvailableImageWidths } from 'sharedTypes/Upload';
import { Ord as NumOrd } from 'fp-ts/number';
import { ap, bindTo, map, chain as IDChain } from 'fp-ts/Identity';
import {
	fromPredicate,
	map as OMap,
	foldW as OFoldW,
	getOrElseW,
} from 'fp-ts/Option';

type TSrcsetCreationType = 'element' | 'string';

const sortAscending = pipe(NumOrd, sort);

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

// Sensible default.  This will never force a browser to load an image that's more than
// one 'size' wider than viewport width
const makeDefaultBreakpoint = (width: number): TDefaultBreakpoint => ({
	type: 'max',
	mediaWidth: width,
	slotWidth: 100,
	slotUnit: 'vw',
	origin: 'default',
});

export const makeDefaultBreakpoints = flow(
	sortAscending,
	pipe(makeDefaultBreakpoint, ArrMap)
);

const sizeFromBreakpoint = ({
	type,
	slotWidth,
	slotUnit,
	mediaWidth,
}: IBreakpoint) => `(${type}-width: ${mediaWidth}px) ${slotWidth}${slotUnit}`;

const sizesFromBreakpoints = (bps: TBreakpoints): string =>
	bps.reduce(
		(str, bp, i, a) =>
			str + sizeFromBreakpoint(bp) + (i === a.length - 1 ? '' : ', '),
		''
	);

// all user-defined breakpoints FIRST, then default breakpoints
export const mergeBreakpoints =
	(ubp: TUserBreakpoints) =>
	(dbp: TDefaultBreakpoints): TBreakpoints =>
		concatW(dbp)(ubp);

// TODO: need to get a flow set up for adding alt text to images
const HTMLStringFromBreakpoints =
	(availableWidths: TAvailableImageWidths) =>
	(publicPath: string) =>
	(bps: TBreakpoints): string =>
		`<img srcset="${makeSrcset(availableWidths)(
			publicPath
		)}" sizes="${sizesFromBreakpoints(bps)}" src="${publicPath}/${
			availableWidths[availableWidths.length - 1]
		}" alt="">`;

const JSXElementFromBreakpoints =
	(availableWidths: TAvailableImageWidths) =>
	(publicPath: string) =>
	(bps: TBreakpoints) =>
		(
			<img
				srcSet={makeSrcset(availableWidths)(publicPath)}
				sizes={sizesFromBreakpoints(bps)}
				src={`${publicPath}/${
					availableWidths[availableWidths.length - 1]
				}`}
				alt=""
			></img>
		);

/**Ordering of sizes:
 * First, build size-matchers for all user-defined breakpoints, in the order in which they were set.
 * Second, build size-matchers for all default breakpoints (derived from available widths), ordered from
 * SMALLEST "max-width" to LARGEST "max-width".  We want to match smaller screens (and load smaller image) FIRST.
 */

export const createSrcset =
	(creationType: TSrcsetCreationType) =>
	(userBreakpoints: TUserBreakpoints) =>
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
