import { pipe } from 'fp-ts/lib/function';
import { ICarouselChild } from './Carousel';

export const calcY = (elementNumber: number) => Math.floor(elementNumber / 5);

export const calcX = (elementNumber: number) => elementNumber % 5;

// slides horizontally
export const advanceHorizontal = (rowID: number) => (cc: ICarouselChild) => {
	if (cc.y === rowID) {
		return {
			...cc,
			x: cc.x === 4 ? 0 : cc.x + 1,
		};
	}
	return cc;
};

export const regressHorizontal = (rowID: number) => (cc: ICarouselChild) => {
	if (cc.y === rowID) {
		return {
			...cc,
			x: cc.x === 0 ? 4 : cc.x - 1,
		};
	}
	return cc;
};
// slides vertically
export const advanceVertical = (colID: number) => (cc: ICarouselChild) => {
	if (cc.x === colID) {
		return {
			...cc,
			y: cc.y === 4 ? 0 : cc.y + 1,
		};
	}
	return cc;
};

export const regressVertical = (colID: number) => (cc: ICarouselChild) => {
	if (cc.x === colID) {
		return {
			...cc,
			y: cc.y === 0 ? 4 : cc.y - 1,
		};
	}
	return cc;
};

type TGridTickDirection = 'advance' | 'regress';
type TGridTickKind = 'column' | 'row';
type TGridTickParameter = 'direction' | 'kind';

interface IGridTick {
	direction: TGridTickDirection;
	kind: TGridTickKind;
	identifier: number;
}

export const getMapper = (config: IGridTick) =>
	config.direction === 'advance'
		? config.kind === 'column'
			? advanceVertical(config.identifier)
			: advanceHorizontal(config.identifier)
		: config.kind === 'column'
		? regressVertical(config.identifier)
		: regressHorizontal(config.identifier);

const getRandomized = (a: TGridTickParameter) => {
	const selection = Math.round(Math.random());
	return a === 'kind'
		? selection === 0
			? 'column'
			: 'row'
		: selection === 0
		? 'advance'
		: 'regress';
};

const getRandomIdentifier = () => Math.ceil(Math.random() * 4);

export const getRandomizedConfig = (): IGridTick => ({
	kind: getRandomized('kind') as TGridTickKind,
	direction: getRandomized('direction') as TGridTickDirection,
	identifier: getRandomIdentifier(),
});

export const getRandomizedMapper = () => pipe(getRandomizedConfig(), getMapper);
