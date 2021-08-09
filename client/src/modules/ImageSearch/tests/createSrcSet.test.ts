import { pipe } from 'fp-ts/lib/function';
import { ap } from 'fp-ts/lib/Identity';
import { TUserBreakpoints } from '../domain/ImageSearchDomainTypes';
import {
    makeDefaultBreakpoints,
    mergeBreakpoints,
} from '../useCases/createSrcSet';

describe("helper function 'mergeBreakpoints", () => {
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

        expect(result.slice(0, 2)).toEqual(receivedFromUser);
    });

    it('returns only the array of default objects if no user breakpoints are defined', () => {});
});
