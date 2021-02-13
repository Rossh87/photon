import { asyncCompose } from './asyncCompose';
import { toMappable } from './toMappable';
import { IWrapAndCompose } from './utilTypes';

// TODO: may want to improve these types and add unit test for this
export const wrapAndCompose = (...args: Array<any>) =>
    asyncCompose(...args.map(toMappable));
