import React from 'react';
import {simulateInvalidFileInput, simulateFileInput} from './preprocessing.test'
import Uploader from '../index';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {mockUser} from './mockData'
import { IUser } from '../../auth/AuthManager/authTypes';
import {getTestJPEGFile, getOversizeImageFile} from '../../../testUtils/imageUtils'
import {createMockFileList} from '../../../testUtils/fileMocks'
import DependencyContext, {IDependencies} from '../../../core/dependencyContext'

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
    })
})