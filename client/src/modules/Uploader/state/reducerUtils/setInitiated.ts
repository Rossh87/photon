import { map as NEAMap } from 'fp-ts/lib/NonEmptyArray';
import { flow } from 'fp-ts/lib/function';
import { IImage } from '../../domain/domainTypes';

export const setInitiated = (initiatedUpload: string) =>
	flow(
		NEAMap<IImage, IImage>((f) =>
			f.displayName === initiatedUpload
				? Object.assign({}, f, { status: 'processing' })
				: f
		)
	);
