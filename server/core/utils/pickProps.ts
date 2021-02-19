import { Result, Either } from 'ts-result';
import { BaseError } from '../error';

// TODO: try and improve these types.  What a disgrace.
export const pickProps = (picker: any) => (a: any) => {
    if (a === null) {
        return Result.left(
            new BaseError({
                hint:
                    'Expected pickProps to be called with 1 argument, but received none',
                raw: null,
            })
        );
    }
    const keys = Object.keys(picker);
    const result = {} as any;

    try {
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const props = picker[key].split('.');
            let value;
            for (let j = 0; j < props.length; j++) {
                const p = props[j];
                if (value) {
                    value = value[p];
                } else {
                    value = a[p];
                }

                if (value === undefined) {
                    throw picker[i];
                }
            }
            result[key] = value;
            value = null;
        }

        return Result.right(result);
    } catch (missingProps) {
        const err = new BaseError({
            hint: `OAuth response failure: property ${missingProps} was missing from response`,
            raw: null,
        });

        return Result.left(err);
    }
};
