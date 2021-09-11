import { none } from 'fp-ts/lib/Option';
import { IImageConfigurationState } from '../../modules/ImageSearch/state/imageConfigurationStateTypes';
import { getMockImageDataOfType } from '.';

// This represents a 'clean' state, i.e. data state immediately
// after configuration dialog has been opened, before any user interaction
const uploadWithBreakpoints = getMockImageDataOfType('withBreakpoints');

export const populatedImageUnderConfig: IImageConfigurationState = {
	isSynchronizedWithBackend: true,
	error: none,
	requestPending: false,
	hasUpdated: false,
	open: true,
	...uploadWithBreakpoints,
};

export const getPopulatedImageUnderConfig = (): IImageConfigurationState => ({
	...populatedImageUnderConfig,
});
