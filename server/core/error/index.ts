import { IBaseError, IBaseErrorParams } from './errorTypes';

export class BaseError extends Error implements IBaseError {
    public hint: string;
    public raw: any;
    public status?: number;

    constructor({ hint, raw, status }: IBaseErrorParams) {
        super();
        this.hint = hint;
        this.raw = raw;
        this.status = status;
    }
}
