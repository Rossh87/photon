import { BaseError } from '../../../core/error';
import { IProcessedFile } from './uploadTypes';

export class UploadError extends BaseError {
    public readonly invalidFile?: IProcessedFile;

    public static create(message: string, file?: IProcessedFile) {
        return new UploadError(message, file);
    }

    private constructor(message: string, file?: IProcessedFile) {
        super(message, null);

        if (file) {
            this.invalidFile = file;
        }
    }
}
