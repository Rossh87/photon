import { map } from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/function';
import { ap } from 'fp-ts/lib/Identity';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { TUserBreakpoints } from '../modules/ImageSearch/domain/ImageSearchDomainTypes';
import {
    createHTMLSrcsetString,
    makeDefaultBreakpoints,
    mergeBreakpoints,
} from './createSrcsetString';

describe("helper function 'mergeBreakpoints'", () => {
    it('returns a merged array with all user-defined breakpoints included first', () => {
        const availableWidths = [300, 1200, 1870];

        const defaultBreakpoints = makeDefaultBreakpoints(availableWidths);

        const receivedFromUser: TUserBreakpoints = [
            {
                type: 'min',
                mediaWidth: 800,
                slotWidth: 200,
                slotUnit: 'px',
                origin: 'user',
            },
            {
                type: 'max',
                mediaWidth: 1200,
                slotWidth: 600,
                slotUnit: 'vw',
                origin: 'user',
            },
        ];

        const result = pipe(
            receivedFromUser,
            mergeBreakpoints,
            ap(defaultBreakpoints)
        );

        expect(result.length).toBe(5);
        expect(result.slice(0, 2)).toEqual(receivedFromUser);
    });

    it('returns only the array of default objects if no user breakpoints are defined', () => {
        const availableWidths = [300, 1200, 1870];

        const defaultBreakpoints = makeDefaultBreakpoints(availableWidths);

        const receivedFromUser: TUserBreakpoints = [];

        const received = pipe(
            receivedFromUser,
            mergeBreakpoints,
            ap(defaultBreakpoints)
        );

        expect(received).toEqual(defaultBreakpoints);
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
    it('generates a correct output string', () => {
        const userBreakpoints: TUserBreakpoints = [
            {
                mediaWidth: 550,
                type: 'min',
                slotWidth: 330,
                slotUnit: 'px',
                origin: 'user',
            },
        ];

        const availableWidths = [1200, 300] as NonEmptyArray<number>;

        const publicPath = 'https://www.example.bucket.com';

        const expected =
            '<img srcset="https://www.example.bucket.com/1200 1200w, https://www.example.bucket.com/300 300w" sizes="(min-width: 550px) 330px, (max-width: 300px) 100vw, (max-width: 1200px) 100vw" src="https://www.example.bucket.com/300" alt="">';

        const received =
            createHTMLSrcsetString(userBreakpoints)(availableWidths)(
                publicPath
            );

        expect(received).toEqual(expected);
    });
});
