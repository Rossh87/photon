import { map as ArrMap } from 'fp-ts/Array';
import { pipe } from 'fp-ts/lib/function';
import { IClientUpload } from 'sharedTypes/Upload';
import { IBreakpointUpdateTransferObject } from '../state/imageSearchStateTypes';

// s.breakpoints.map((bp) =>
// 					bp._id === a.payload._id ? a.payload : bp

export const applyBreakpointToImages =
	(updatePayload: IBreakpointUpdateTransferObject) =>
	(images: IClientUpload[]) =>
		pipe(
			images,
			ArrMap((image) =>
				image._id === updatePayload.imageID
					? { ...image, breakpoints: updatePayload.breakpoints }
					: image
			)
		);
