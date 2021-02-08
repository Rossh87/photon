import { Request } from 'express';
import { Either } from 'ts-result';

export interface IOAuthFailure extends Error {
    hint: string;
}

type TOAuthAccessToken = string;

export interface IAccessTokenExtractor {
    (req: Request): Either<Error, TOAuthAccessToken>;
}
