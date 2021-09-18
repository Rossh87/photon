import { makeStyles } from '@material-ui/core';

export const useCarouselStyles = makeStyles((theme) => ({
	carouselItem: {
		position: 'absolute',
		background: 'none',
		border: 'none',
		padding: 0,
		margin: 0,
		opacity: 0,
		transition: 'transform 1s ease, opacity 0.4s ease',
	},

	carouselSection: {
		position: 'absolute',
		top: '-150',
	},

	visible: {
		opacity: 1,
	},
}));
