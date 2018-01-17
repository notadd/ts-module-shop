import {HttpStatus} from "@nestjs/common";
import {IErrorMessages} from "../common/error.interface";

export const errorMessagesConfig: { [messageCode: string]: IErrorMessages } = {
    'create:missingInformation': {
        type: 'BadRequest',
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage: 'Unable to create a new navigation with missing information.',
        userMessage: 'Unable to create a new navigation with missing information.',
    },
};