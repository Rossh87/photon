import { constructPublicBasePath } from './constructPublicBasePath';
import { IUploadableBlob } from '../modules/Uploader/domain/domainTypes';
import basePublicImagePath from './basePublicImagePath';

describe('function to build the public path for user-uploaded images', () => {
	it("uri encodes the image's display name", () => {
		const uploadable = {
			metaData: {
				displayName: 'This has some spaces.png',
				ownerID: '1234',
			},
		} as unknown as IUploadableBlob;

		const encodedName = encodeURIComponent(uploadable.metaData.displayName);

		const expected = `${basePublicImagePath}/1234/${encodedName}`;

		const received = constructPublicBasePath(uploadable);

		expect(received).toEqual(expected);
	});
});
