import { TFetchedImageData } from '../domain/ImageSearchDomainTypes';

export const mockImage1: TFetchedImageData = {
	_id: 'ak2254',
	ownerID: 'abc123',
	displayName: 'A day in the Alps',
	mediaType: 'img/jpeg',
	sizeInBytes: 56669,
	integrityHash: ['1234', 'aabc', 'ggdf'],
	availableWidths: [250, 700, 1120],
	publicPathPrefix: 'www.google-bucket/photon/A-day-in-the-alps',
};

export const mockImage2: TFetchedImageData = {
	_id: '128892',
	ownerID: 'abc123',
	displayName: 'Bears everywhere!!',
	mediaType: 'img/jpeg',
	sizeInBytes: 67455,
	integrityHash: ['kk291', 'ywx8', '1171'],
	availableWidths: [250, 700, 1200],
	publicPathPrefix: 'www.google-bucket/photon/bears-everywhere!!',
};

export const mockImage3: TFetchedImageData = {
	_id: '128772',
	ownerID: 'abc123',
	displayName: 'lotsa cats',
	mediaType: 'img/jpeg',
	sizeInBytes: 67455,
	integrityHash: ['kk231', 'y838', 'ab882'],
	availableWidths: [250, 700, 1200],
	publicPathPrefix: 'www.google-bucket/photon/lotsa-cats',
};

export const mockImage4: TFetchedImageData = {
	_id: '128796',
	ownerID: 'abc123',
	displayName: 'even more cats',
	mediaType: 'img/jpeg',
	sizeInBytes: 67455,
	integrityHash: ['kk231', 'y838', 'ab882'],
	availableWidths: [250, 700, 1200],
	publicPathPrefix: 'www.google-bucket/photon/even-more-cat',
};

export const mockImageData = [mockImage1, mockImage2, mockImage3, mockImage4];
