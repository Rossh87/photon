import { IClientUpload } from 'sharedTypes/Upload';
import {
	TUserBreakpointUI,
} from '../state/imageConfigurationStateTypes';

const addedString = new Date().toISOString();

export const mockImage1: IClientUpload = {
	_id: 'ak2254',
	ownerID: 'abc123',
	displayName: 'A day in the Alps',
	mediaType: 'image/jpeg',
	sizeInBytes: 56669,
	integrityHash: ['1234', 'aabc', 'ggdf'],
	availableWidths: [250, 700, 1120],
	publicPathPrefix: 'www.google-bucket/photon/A-day-in-the-alps',
	breakpoints: [],
	addedOn: addedString,
};

export const mockImage2: IClientUpload = {
	_id: '128892',
	ownerID: 'abc123',
	displayName: 'Bears everywhere!!',
	mediaType: 'image/jpeg',
	sizeInBytes: 67455,
	integrityHash: ['kk291', 'ywx8', '1171'],
	availableWidths: [250, 700, 1200],
	publicPathPrefix: 'www.google-bucket/photon/bears-everywhere!!',
	breakpoints: [],
	addedOn: addedString,
};

export const mockImage3: IClientUpload = {
	_id: '128772',
	ownerID: 'abc123',
	displayName: 'lotsa cats',
	mediaType: 'image/jpeg',
	sizeInBytes: 67455,
	integrityHash: ['kk231', 'y838', 'ab882'],
	availableWidths: [250, 700, 1200],
	publicPathPrefix: 'www.google-bucket/photon/lotsa-cats',
	breakpoints: [],
	addedOn: addedString,
};

export const mockImage4: IClientUpload = {
	_id: '128796',
	ownerID: 'abc123',
	displayName: 'even more cats',
	mediaType: 'image/jpeg',
	sizeInBytes: 67455,
	integrityHash: ['kk231', 'y838', 'ab882'],
	availableWidths: [250, 700, 1200],
	publicPathPrefix: 'www.google-bucket/photon/even-more-cat',
	addedOn: addedString,
	breakpoints: [
		{
			queryType: 'min',
			mediaWidth: 800,
			slotWidth: 200,
			slotUnit: 'px',
			_id: '1234',
		},
		{
			queryType: 'max',
			mediaWidth: 1150,
			slotWidth: 600,
			slotUnit: 'vw',
			_id: '5678',
		},
	],
};

export const mockBreakpointData: TUserBreakpointUI = {
	queryType: 'min',
	mediaWidth: '800',
	slotWidth: '200',
	slotUnit: 'px',
	_id: '1234',
	origin: 'user',
	editing: false,
};

export const mockImageData = [mockImage1, mockImage2, mockImage3, mockImage4];
