export class BaseError extends Error {
    constructor(public readonly message: string, public readonly raw?: any) {
        super(message);
        this.raw = raw;
    }
}
