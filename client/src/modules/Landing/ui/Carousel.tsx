import React, { useEffect, useState } from 'react';
import { useCarouselStyles } from './useCarouselStyles';
import CarouselChild from './CarouselChild';
import { calcX, calcY, getRandomizedMapper } from './carouselHelpers';
import { pipe } from 'fp-ts/lib/function';
import { map, mapWithIndex } from 'fp-ts/lib/Array';
import { ap } from 'fp-ts/lib/Identity';
import imageData, { TBaseCarouselData } from '../imageData';
// @ts-ignore
import shuffle from 'knuth-shuffle-seeded';
import { useMediaQuery, useTheme } from '@material-ui/core';

/*
 * Adapted from:
 * https://letsbuildui.dev/articles/building-a-vertical-carousel-component-in-react
 */

export interface ICarouselChild {
	url: string;
	href: string;
	x: number;
	y: number;
	id: number;
	tileSize: number;
	content: any;
	itemWidth: number;
}

const Carousel: React.FunctionComponent = () => {
	const classes = useCarouselStyles();
	const theme = useTheme();

	const smallMatched = useMediaQuery(theme.breakpoints.down('sm'));
	const tinyMatched = useMediaQuery(theme.breakpoints.down('xs'));

	enum sizes {
		tinyMatched = 75,
		smallMatched = 100,
		normalMatched = 150,
	}

	const calcSize = () =>
		tinyMatched
			? sizes.tinyMatched
			: smallMatched
			? sizes.smallMatched
			: sizes.normalMatched;

	const tileSize = calcSize();
	const itemWidth = calcSize();
	const toCarouselChildProps = (
		i: number,
		{ url, href }: TBaseCarouselData
	): ICarouselChild => ({
		content: i,
		id: i,
		x: calcX(i),
		y: calcY(i),
		tileSize,
		url,
		href,
		itemWidth,
	});

	const imagePropsArray = pipe(
		imageData,
		shuffle,
		mapWithIndex(toCarouselChildProps)
	);

	const [data, setData] = useState<ICarouselChild[]>(
		imagePropsArray as ICarouselChild[]
	);

	useEffect(() => {
		const intervalID = setInterval(
			() => pipe(getRandomizedMapper(), map, ap(data), setData),
			2000
		);

		return () => clearInterval(intervalID);
	});

	return (
		<>
			{data.map((ccProps: ICarouselChild) => (
				<CarouselChild
					{...ccProps}
					key={ccProps.id}
					tileSize={tileSize}
					itemWidth={itemWidth}
				/>
			))}
		</>
	);
};

export default Carousel;
