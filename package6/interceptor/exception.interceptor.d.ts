import { NestInterceptor, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
export declare class ExceptionInterceptor implements NestInterceptor {
    intercept(dataOrRequest: any, context: ExecutionContext, stream$: Observable<any>): Observable<any>;
}
