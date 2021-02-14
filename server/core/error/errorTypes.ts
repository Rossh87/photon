// TODO: may want to get rid of these 'core' types and have erro types only in modules
export interface IBaseErrorParams {
    hint: string;
    raw: any;
    status?: number;
}

export interface IBaseError extends IBaseErrorParams, Error {}
