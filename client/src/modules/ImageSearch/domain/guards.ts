import { Refinement } from 'fp-ts/Refinement';
import {
    IBreakpoint,
    TDefaultBreakpoint,
    TUserBreakpoint,
} from './ImageSearchDomainTypes';

export const isUserBreakpoint: Refinement<IBreakpoint, TUserBreakpoint> =
    function (b): b is TUserBreakpoint {
        return b.origin === 'user';
    };

export const isDefaultBreakpoint: Refinement<IBreakpoint, TDefaultBreakpoint> =
    function (b): b is TDefaultBreakpoint {
        return b.origin === 'default';
    };
