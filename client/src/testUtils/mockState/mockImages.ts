import ObjectID from 'bson-objectid';
import { identity, pipe } from 'fp-ts/lib/function';
import { fold, fromPredicate, map } from 'fp-ts/lib/Option';
import { nanoid } from 'nanoid';
import { IClientUpload } from '../../../../sharedTypes/Upload';
import { IImageSearchState } from '../../modules/ImageSearch/state/imageSearchStateTypes';
import { getMockUserID } from './mockUser';

type BaseImage = Omit<IClientUpload, '_id' | 'ownerID' | 'addedOn'>;

// valid bson timestamps from newest to oldest
const imageCreationTimes = Array(4)
	.fill(null)
	.map((_, i) =>
		new ObjectID(Date.now() - 5000 * i).getTimestamp().toString()
	);
// console.log('times:', imageCreationTimes);
// valid bson ids for Upload objects
const imageIds = Array(4)
	.fill(null)
	.map(() => new ObjectID().toHexString());

const breakpointIDs = Array(2)
	.fill(null)
	.map((_) => nanoid());

const zipMocks = (
	userId: string,
	imageIDs: string[],
	creationTimes: string[],
	baseImages: BaseImage[]
): IClientUpload[] =>
	pipe(
		imageIDs,
		fromPredicate(
			(_) =>
				imageIDs.length === creationTimes.length &&
				imageIDs.length === baseImages.length
		),
		map(() =>
			imageIDs.map((_, i) => ({
				...baseImages[i],
				addedOn: creationTimes[i],
				ownerID: userId,
				_id: imageIDs[i],
			}))
		),
		fold(() => {
			throw new Error('bad data passed to image mock creation!!');
		}, identity)
	);

export const mockImage1: BaseImage = {
	displayName: 'A day in the Alps',
	mediaType: 'image/jpeg',
	sizeInBytes: 56669,
	integrityHash: ['1234', 'aabc', 'ggdf'],
	availableWidths: [250, 700, 1120],
	publicPathPrefix: 'www.google-bucket/photon/A-day-in-the-alps',
	breakpoints: [],
};

export const mockImage2: BaseImage = {
	displayName: 'Bears everywhere!!',
	mediaType: 'image/jpeg',
	sizeInBytes: 67455,
	integrityHash: ['kk291', 'ywx8', '1171'],
	availableWidths: [250, 700, 1200],
	publicPathPrefix: 'www.google-bucket/photon/bears-everywhere!!',
	breakpoints: [],
};

export const mockImage3: BaseImage = {
	displayName: 'lotsa cats',
	mediaType: 'image/png',
	sizeInBytes: 21010,
	integrityHash: ['kk231', 'y838', 'ab882'],
	availableWidths: [250, 700, 1200],
	publicPathPrefix: 'www.google-bucket/photon/lotsa-cats',
	breakpoints: [],
};

export const mockImage4: BaseImage = {
	displayName: 'even more cats',
	mediaType: 'image/webp',
	sizeInBytes: 2312,
	integrityHash: ['kk231', 'y838', 'ab882'],
	availableWidths: [250, 700, 1200],
	publicPathPrefix: 'www.google-bucket/photon/even-more-cat',
	breakpoints: [
		{
			queryType: 'min',
			mediaWidth: 800,
			slotWidth: 200,
			slotUnit: 'px',
			_id: breakpointIDs[0],
		},
		{
			queryType: 'max',
			mediaWidth: 1150,
			slotWidth: 600,
			slotUnit: 'vw',
			_id: breakpointIDs[1],
		},
	],
};

const baseImages = [mockImage1, mockImage2, mockImage3, mockImage4];

const mockImages = zipMocks(
	getMockUserID(),
	imageIds,
	imageCreationTimes,
	baseImages
);

type MockImageSelectors = 'webp' | 'jpeg' | 'withBreakpoints' | 'png';

export const getMockImageDataOfType = (selector: MockImageSelectors) => {
	switch (selector) {
		case 'webp':
			return { ...mockImages[3] };
		case 'jpeg':
			return { ...mockImages[0] };
		case 'withBreakpoints':
			return { ...mockImages[3] };
		case 'png':
			return { ...mockImages[2] };
	}
};

const mockImagesState: IImageSearchState = {
	imageMetadata: mockImages,
	currentlyActiveImages: mockImages,
};

export const getMockImageMetadata = () => mockImagesState.imageMetadata.slice();

export const getMockCurrentlyActiveImages = () =>
	mockImagesState.currentlyActiveImages.slice();

export default mockImagesState;
