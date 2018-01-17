import {HttpStatus} from "@nestjs/common";
import {IErrorMessages} from "../common/error.interface";

export const errorMessagesConfig: { [messageCode: string]: IErrorMessages } = {
    'create:missingInformation': {
        type: 'BadRequest',
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage: 'Unable to create a new navigation with missing information.',
        userMessage: 'Unable to create a new navigation with missing information.',
    },
    'delete:recycling:idMissing':{
        type: 'BadRequest',
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage:'The current id corresponding to the data does not exist.',
        userMessage:'The current id corresponding to the data does not exist.',
    },
    'create:publishedTime:lessThan':{
        type: 'BadRequest',
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage:'The published time cannot be less than the current time.',
        userMessage:'The published time cannot be less than the current time.',
    }
};