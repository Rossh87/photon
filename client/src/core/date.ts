// User info from database will include a 'joined on'
// property that is output of Date.toJSON.  Here we format
// it for display before storing it in app state.

import { pipe } from 'fp-ts/lib/function';

const mos = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

export const formatJoinDate = (dateString: string) => {
	// dateString comes from Mongo ObjectId, so it's
	// reasonably safe to assume it will be valid...right?
	const d = new Date(dateString);

	const month = mos[d.getMonth()];
	console.log('month: ', month);
	const date = d.getDate();
	const year = d.getFullYear();

	return `${month} ${date}, ${year}`;
};
