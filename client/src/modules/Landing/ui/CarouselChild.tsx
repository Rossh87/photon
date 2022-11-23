import { Box } from '@mui/material';
import React, { ReactElement, memo } from 'react';
import { ICarouselChild } from './Carousel';
import { useCarouselStyles } from './useCarouselStyles';
import clsx from 'clsx';

const CarouselChild: React.FunctionComponent<ICarouselChild> = ({
	x,
	y,
	tileSize,
	itemWidth,
	url,
	id,
	href,
}) => {
	const classes = useCarouselStyles();

	const offsetX = (tileSize + 15) * x;

	const offsetY = (tileSize + 15) * y;

	const isVisibleX = x <= 3 && x >= 1;

	const isVisibleY = y <= 3 && y >= 1;

	const isVisible = isVisibleX && isVisibleY;

	const carouselItemStyles = clsx(
		classes.carouselItem,
		isVisible && classes.visible
	);

	return (
		<a href={href} aria-hidden={isVisible}>
			<Box
				width={`${itemWidth}px`}
				height={`${itemWidth}px`}
				className={carouselItemStyles}
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
