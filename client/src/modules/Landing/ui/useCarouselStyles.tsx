import { makeStyles } from '@material-ui/core';

export const useCarouselStyles = makeStyles((theme) => ({
	// button: {
	// 	cursor: 'pointer',
	// },

	// img: {
	// 	maxWidth: '100%',
	// },

	// outerContainer: {
	// 	maxWidth: '800px',
	// 	margin: 'auto',
	// 	display: 'flex',
	// 	border: '1px solid #ccc',
	// 	borderRadius: '5px',
	// 	boxShadow: '1px 3px 6px rgba(0, 0, 0, 0.3)',
	// 	// overflow: 'hidden',
	// },

	// carouselWrapper: {
	// 	display: 'flex',
	// 	flexDirection: 'column',
	// },

	// carousel: {
	// 	height: '100%',
	// 	display: 'flex',
	// 	flex: '5',
	// 	alignItems: 'center',
	// },

	// slides: {
	// 	alignSelf: 'flex-start',
	// 	flex: '1',
	// 	width: '100%',
	// 	// overflow: 'hidden',
	// },

	// carouselInner: {
	// 	position: 'relative',
	// 	maxHeight: '250px',
	// 	height: '250px',
	// },

	//   .carousel-inner::before,
	//   .carousel-inner::after {
	// 	content: "";
	// 	z-index: 1;
	// 	position: absolute;
	// 	width: 100%;
	// 	height: 110px;
	// 	pointer-events: none;
	//   }

	//   .carousel-inner::before {
	// 	top: 0;
	// 	background: linear-gradient(
	// 	  0deg,
	// 	  hsla(0, 0%, 100%, 0) 0%,
	// 	  hsla(27, 100%, 48%, 1) 100%
	// 	);
	//   }

	//   .carousel-inner::after {
	// 	bottom: 0;
	// 	background: linear-gradient(
	// 	  0deg,
	// 	  hsla(27, 100%, 48%, 1) 0%,
	// 	  hsla(0, 0%, 100%, 0) 100%
	// 	);
	//   }

	carouselItem: {
		position: 'absolute',
		background: 'none',
		border: 'none',
		padding: 0,
		margin: 0,
		opacity: 0,
		// top: '112px',
		transition: 'transform 1s ease, opacity 0.4s ease',
	},

	// carouselContainer: {
	// 	position: 'relative',
	// 	width: '300px',
	// 	height: '300px',
	// },

	carouselSection: {
		position: 'absolute',
		top: '-150',
	},

	visible: {
		opacity: 1,
	},
}));
