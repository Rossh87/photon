import { pipe } from 'fp-ts/lib/function';
import { fromNullable, getOrElseW } from 'fp-ts/lib/Option';

// This will blow up at build time if public image path is missing
const throwIfEnvMissingInProduction = () =>
	pipe(
		process.env.REACT_APP_PUBLIC_IMAGE_BASE_URL,
		fromNullable,
		getOrElseW(() => {
			throw new Error(
				'PULIC_IMAGE_BASE_URL missing from production environment'
			);
		})
	);

const getBasePublicImagePath = () =>
	process.env.NODE_ENV === 'production'
		? throwIfEnvMissingInProduction()
		: 'https://storage.googleapis.com/photon_user_images';

const basePublicImagePath = getBasePublicImagePath();

export default basePublicImagePath;
