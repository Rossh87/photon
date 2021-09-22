import { pipe } from 'fp-ts/lib/function';
import { fromNullable, getOrElseW } from 'fp-ts/lib/Option';

// This will blow up at build time if public image path is missing
const throwIfEnvMissingInProduction = () =>
	pipe(
		process.env.REACT_APP_API_ROOT,
		fromNullable,
		getOrElseW(() => {
			throw new Error('API_ROOT missing from production environment');
		})
	);

const getAPIRoot = () =>
	process.env.NODE_ENV === 'production'
		? throwIfEnvMissingInProduction()
		: 'http://localhost:8000';

const apiRoot = getAPIRoot();

export default apiRoot;
