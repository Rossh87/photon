import { makeStyles } from '@material-ui/core';

export const useCarouselStyles = makeStyles((theme) => ({
	carouselItem: {
		position: 'absolute',
		background: 'none',
		border: 'none',
		padding: 0,
		margin: 0,
		opacity: 0,
		transition: 'transform 1.75s ease, opacity 0.4s ease',
		cursor: 'default',
		pointerEvents: 'none',
	},

	carouselSection: {
		position: 'absolute',
		top: '-150',
	},

	visible: {
		opacity: 1,
		cursor: 'pointer',
		pointerEvents: 'auto',
	},
}));
