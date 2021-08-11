import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockImage1 } from './mockData';
import ImageItem from '../ui/ImageItem';
import { IDBUpload } from 'sharedTypes/Upload';

let mockImageData: IDBUpload;

beforeEach(() => (mockImageData = Object.assign({}, mockImage1)));

describe('The ImageItem component', () => {
    it('opens embed code configuration dialog when clicked', () => {
        render(<ImageItem {...mockImageData} />);

        const getDialogElement = () =>
            screen.getByText('Embed code', { exact: false });

        const imgThumbnail = screen.getByRole('button');

        // ensure test is valid by checking that Dialog is *closed*, i.e. not mounted
        expect(getDialogElement).toThrow();

        act(() => userEvent.click(imgThumbnail));

        expect(getDialogElement()).toBeTruthy();
    });
});
