/**
 * adapted from
 * https://dev.to/n8tb1t/tracking-scroll-position-with-react-hooks-3bbj
 */

import { useLayoutEffect, useState } from 'react';

const isBrowser = typeof window !== 'undefined';

const useTopDetection = () => {
	const [isAtTop, setAtTop] = useState(true);

	// never update if we're not in a browser.
	const set = () => {
		if (!isBrowser) {
			return;
		}

		setAtTop(window.scrollY === 0 ? true : false);
	};

	let activeTimeout: null | ReturnType<typeof setTimeout> = null;

	const callback = () => {
		activeTimeout = null;
		set();
	};

	useLayoutEffect(() => {
		const onScroll = () => {
			if (!activeTimeout) {
				return (activeTimeout = setTimeout(callback, 150));
			}

			callback();
		};

		window.addEventListener('scroll', onScroll);

		return () => {
			if (activeTimeout) {
				clearTimeout(activeTimeout);
			}

			window.removeEventListener('scroll', onScroll);
		};
	});

	return isAtTop;
};

export default useTopDetection;
