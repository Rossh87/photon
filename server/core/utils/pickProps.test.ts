import { pickProps } from './pickProps';
import { IPickProps, TPicker } from './utilTypes';
import { Result } from 'ts-result';
import { BaseError } from '../error';

describe('the util function pickProps', () => {
    it("should compile with the types we've created", () => {
        interface IInputVal {
            inputName: string;
            inputAge: number;
        }

        interface IOutputVal {
            name: string;
            age: string;
        }

        const inputPicker: TPicker<IOutputVal> = {
            name: 'inputName',
            age: 'inputAge',
        };

        const input: IInputVal = {
            inputAge: 22,
            inputName: 'tim',
        };

        const normalize: IPickProps<IInputVal, IOutputVal> = pickProps(
            inputPicker
        );

        const result = normalize(input);
    });

    it('returns a function', () => {
        expect(typeof pickProps).toBe('function');
    });

    it('picks correct values from input objects', () => {
        const input = {
            name: 'tom',
        };

        const picker = {
            outputName: 'name',
        };

        const received = pickProps(picker)(input);

        expect(received).toEqual(Result.right({ outputName: 'tom' }));
    });

    it('works with nested inputs', () => {
        const input = {
            name: 'tom',
            metaData: {
                role: 'author',
                promotions: {
                    promo1: {
                        reason: 'heroism',
                    },
                    promo2: {
                        reason: 'tenure',
                    },
                },
            },
        };

        const picker = {
            promotionReason1: 'metaData.promotions.promo1.reason',
            promotionReason2: 'metaData.promotions.promo2.reason',
        };

        const received = pickProps(picker)(input);

        expect(received).toEqual(
            Result.right({
                promotionReason1: 'heroism',
                promotionReason2: 'tenure',
            })
        );
    });

    it('returns a Left with a meaningful error if needed properties are missing', () => {
        const input = {
            name: 'tom',
            metaData: {
                role: 'author',
                promotions: {
                    promo1: {
                        reason: 'heroism',
                    },
                },
            },
        };

        const picker = {
            promotionReason1: 'metaData.promotions.promo1.reason',
            promotionReason2: 'metaData.promotions.promo2.reason',
        };

        const received = pickProps(picker)(input);

        const expectedErr = new BaseError({
            hint: `OAuth response failure: property metaData.promotions.promo2.reason was missing from response`,
            raw: null,
        });

        expect(received).toEqual(Result.left(expectedErr));
    });

    it('errors if it is called without an input argument', () => {
        const picker = {
            name: 'name',
        };
        // @ts-ignore
        const received = pickProps(picker)();

        const expectedErr = new BaseError({
            hint: `pickProps expected to be called with 1 argument, but received 0`,
            raw: null,
        });

        expect(received).toEqual(Result.left(expectedErr));
    });
});
