import React from 'react';
import {simulateInvalidFileInput, simulateFileInput} from './preprocessing.test'
import Uploader from '../index';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {mockUser} from './mockData'
import { IUser } from '../../auth/AuthManager/authTypes';
import {getTestJPEGFile, getOversizeImageFile} from '../../../testUtils/imageUtils'
import {createMockFileList} from '../../../testUtils/fileMocks'
import DependencyContext, {IDependencies, createDependenciesObject, TImageResizer} from '../../../core/dependencyContext'
import {REQUEST_UPLOAD_URI_ENDPOINT, BASE_PUBLIC_IMAGE_PATH, SAVE_SUCCESSFUL_UPLOAD_DATA_ENDPOINT} from '../http/endpoints'
import {ResumableUploadCreationErr, IUploadsRequestPayload, IUploadRequestMetadata, IUploadsResponsePayload} from '../http/httpTypes'
import { IResizingData, IImage } from '../domain/domainTypes';
import {AxiosInstance} from 'axios';


describe('Uploader component when files are submitted', () => {
    it('does nothing if selected files have errors', () => {
        const mockDeps = ({http: jest.fn(), imageReducer: jest.fn(), dispatch: jest.fn()}) as IDependencies<any>
        render(
            <DependencyContext.Provider value={() => mockDeps}>
                <Uploader user={mockUser}/>
            </DependencyContext.Provider>
        );

		const input = screen.getByLabelText('Choose Files');
        const submitButton = screen.getByText('Submit!');
		
        simulateInvalidFileInput(getOversizeImageFile)('invalidSelection')(input);

        userEvent.click(submitButton);

        expect(mockDeps.imageReducer).not.toHaveBeenCalled();
    }),

	it.only('displays correct error message on files that fail to upload', async () => {
		const mockUploadReqData: IUploadRequestMetadata = {
			ownerID: '1234',
			displayName: 'mockImg',
			mediaType: 'img/jpg',
			sizeInBytes: 1024,
			integrityHash: '1234',
			width: 250
		}

		const mockFailureData: ResumableUploadCreationErr = {
			rawError: 'some failure',
			requestedUpload: mockUploadReqData,
			message: 'request for upload failed'
		}

		const mockURIData: IUploadsResponsePayload = {
			failures: [mockFailureData]
		}
		const mockAxios = {
			post: jest.fn(() => Promise.resolve(mockURIData))
		} as unknown as AxiosInstance

		const mockImageData: IImage = Object.assign({}, getTestJPEGFile('testImage', 'small'),  {
			humanReadableSize: '1005',
			ownerID: '1234',
			displayName: 'testImage',
			originalSizeInBytes: 1000,
			status: 'preprocessed' as 'preprocessed'
		})

		const mockResizingData = Object.assign({}, mockImageData, {
			resizedImages: Object.assign({}, mockImageData, {
				originalCanvas: document.createElement('canvas'),
				neededWidths: [250],
				resizedBlobs: [{blob: new Blob(), metaData: mockUploadReqData}]
			}) as IResizingData
		
		})

		const mockResizer = jest.fn(() => Promise.reject(new Error('failed'))) as unknown as TImageResizer

		const mockDeps = createDependenciesObject(mockAxios)(mockResizer);

		render(
            <DependencyContext.Provider value={mockDeps}>
                <Uploader user={mockUser}/>
            </DependencyContext.Provider>
        );

		const input = screen.getByLabelText('Choose Files');

        const submitButton = screen.getByText('Submit!');
		
        simulateFileInput(input);

        userEvent.click(submitButton);

		const result = await screen.findByText('request for upload failed')

		console.log(result);
		expect(result).toBeNull();
	})
})