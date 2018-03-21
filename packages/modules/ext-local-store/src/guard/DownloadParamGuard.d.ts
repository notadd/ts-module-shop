import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs/Observable';
export declare class DownloadParamGuard implements CanActivate {
    canActivate(req: any, context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}
