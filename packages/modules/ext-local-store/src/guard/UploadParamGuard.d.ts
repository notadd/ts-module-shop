import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class UploadParamGuard implements CanActivate {
    canActivate(req: any, context: ExecutionContext): Promise<boolean>;
}
