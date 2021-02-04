export type UserRole = 'uploader' | 'admin' | 'tourist';

export interface IConstructor<T> {
    new (...args: any[]): T;
}
