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
    },
    'create:classify:parentIdMissing':{
        type: 'BadRequest',
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage:'The upper level classification does not exist.',
        userMessage:'The upper level classification does not exist.'
    },
    'create:classify:aliasRepeat':{
        type: 'BadRequest',
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage:'New classification alias cannot be repeated, please re-enter.',
        userMessage:'New classification alias cannot be repeated, please re-enter.',
    },
    'update:classify:updateById':{
        type: 'BadRequest',
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage:'The id corresponding classification does not exist, please re-enter.',
        userMessage:'The id corresponding classification does not exist, please re-enter.',
    }
};