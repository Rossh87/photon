import { Box } from '@material-ui/core';
import React from 'react';
import { ICarouselChild } from './Carousel';
import { useCarouselStyles } from './useCarouselStyles';
import clsx from 'clsx';

const CarouselChild: React.FunctionComponent<ICarouselChild> = ({
	x,
	y,
	id,
	tileSize,
	itemWidth,
	url,
	href,
}) => {
	const classes = useCarouselStyles();

	const offsetX = (tileSize + 15) * x;
	const offsetY = (tileSize + 15) * y;

	const isVisibleX = x <= 3 && x >= 1;

	const isVisibleY = y <= 3 && y >= 1;
	const s = clsx(
		classes.carouselItem,
		isVisibleX && isVisibleY && classes.visible
		// classes.visible
	);
	return (
		<a href={href}>
			<Box
				width={`${itemWidth}px`}
				height={`${itemWidth}px`}
				// width="150px"
				// height="150px"
				className={s}
				style={{
					transform: `translateX(${offsetX}px) translateY(${offsetY}px)`,

					backgroundImage: `url(${url})`,
					backgroundSize: 'cover',
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'center',
				}}
			></Box>
		</a>
	);
};

export default CarouselChild;
