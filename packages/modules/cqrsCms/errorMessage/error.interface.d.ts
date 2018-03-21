export declare class MessageCodeError extends Error {
    messageCode: string;
    httpStatus: number;
    errorMessage: string;
    constructor(messageCode: string);
    private getMessageFromMessageCode(messageCode);
}
