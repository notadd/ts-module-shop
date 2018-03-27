import { ExceptionFilter } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
export declare class UpyunExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, response: any): void;
}
