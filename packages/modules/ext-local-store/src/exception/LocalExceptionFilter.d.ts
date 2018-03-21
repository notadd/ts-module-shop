import { ExceptionFilter } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
export declare class LocalExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, response: any): void;
}
