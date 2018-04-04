import { Interceptor, NestInterceptor, ExecutionContext, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

@Interceptor()
export class ExceptionInterceptor implements NestInterceptor {

    intercept(dataOrRequest, context: ExecutionContext, stream$: Observable<any>): Observable<any> {

        return stream$.catch((err, caught): any => {
            if (err instanceof HttpException) {
                return Promise.resolve({
                    code: err.getStatus(),
                    message: err.getResponse()
                })
            } else {
                return Promise.resolve({
                    code: 500,
                    message: '出现了意外错误' + err.toString()
                })
            }
        })
    }
}