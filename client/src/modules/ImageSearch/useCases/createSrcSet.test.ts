import React from 'react';
import { map } from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/function';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { TSavedBreakpoints } from 'sharedTypes/Breakpoint';
import { createSrcset, mergeBreakpoints } from './createSrcset';
import {
	makeDefaultBreakpoints,
} from '../helpers/makeDefaultUIBreakpoints';

describe("helper function 'mergeBreakpoints'", () => {
	it('returns a merged array with all user-defined breakpoints included first', () => {
		const availableWidths = [300, 1200, 1870];

		const defaultBreakpoints = makeDefaultBreakpoints(availableWidths);

		const receivedFromUser: TSavedBreakpoints = [
			{
				queryType: 'min',
				mediaWidth: 800,
				slotWidth: 200,
				slotUnit: 'px',
				_id: '1234',
			},
			{
				queryType: 'max',
				mediaWidth: 1200,
				slotWidth: 600,
				slotUnit: 'vw',
				_id: '5678',
			},
		];

		const result = mergeBreakpoints(receivedFromUser)(defaultBreakpoints);

		expect(result.length).toBe(5);
		expect(result.slice(0, 2)).toEqual(receivedFromUser);
	});

	it('returns only the array of default objects if no user breakpoints are defined', () => {
		const availableWidths = [300, 1200, 1870];

		const defaultBreakpoints = makeDefaultBreakpoints(availableWidths);

		const receivedFromUser: TSavedBreakpoints = [];

		const result = mergeBreakpoints(receivedFromUser)(defaultBreakpoints);

		expect(result).toEqual(defaultBreakpoints);
	});
});

describe('the helper function "makeDefaultBreakpoints"', () => {
	it('sorts generated breakpoints in ascending order by input width', () => {
		const availableWidths = [1200, 300, 1870];

		const result = makeDefaultBreakpoints(availableWidths);

		const received = pipe(
			result,
			map((x) => x.mediaWidth)
		);

		const expected = [300, 1200, 1870];

		expect(received).toEqual(expected);
	});
});

describe('createSrcSet', () => {
	it('generates a correct output string when configured to produce a string', () => {
		const userBreakpoints: TSavedBreakpoints = [
			{
				mediaWidth: 550,
				queryType: 'min',
				slotWidth: 330,
				slotUnit: 'px',
				_id: '1234',
			},
		];

		const availableWidths = [1200, 300] as NonEmptyArray<number>;

		const publicPath = 'https://www.example.bucket.com';

		const expected =
			'<img srcset="https://www.example.bucket.com/1200 1200w, https://www.example.bucket.com/300 300w" sizes="(min-width: 550px) 330px, (max-width: 300px) 100vw, (max-width: 1200px) 100vw" src="https://www.example.bucket.com/300" alt="">';

		const received =
			createSrcset('string')(userBreakpoints)(availableWidths)(
				publicPath
			);

		expect(received).toEqual(expected);
	});

	it('generates a correct JSX element when configured to produce an element', () => {
		const userBreakpoints: TSavedBreakpoints = [
			{
				mediaWidth: 550,
				queryType: 'min',
				slotWidth: 330,
				slotUnit: 'px',
				_id: '1234',
			},
		];

		const availableWidths = [1200, 300] as NonEmptyArray<number>;

		const publicPath = 'https://www.example.bucket.com';

		const expected = React.createElement('img', {
			srcSet: 'https://www.example.bucket.com/1200 1200w, https://www.example.bucket.com/300 300w',
			sizes: '(min-width: 550px) 330px, (max-width: 300px) 100vw, (max-width: 1200px) 100vw',
			src: 'https://www.example.bucket.com/300',
			alt: '',
			style: { maxWidth: '100%' },
		});

		const received =
			createSrcset('element')(userBreakpoints)(availableWidths)(
				publicPath
			);

		expect(received).toEqual(expected);
	});
});
