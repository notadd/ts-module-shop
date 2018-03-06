import { Guard, CanActivate, ExecutionContext ,HttpException} from '@nestjs/common';
import { Observable } from 'rxjs/Observable';

@Guard()
export class DownloadParamGuard implements CanActivate {
    canActivate(req, context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        let { bucketName , fileName } = req.headers 
        if(!bucketName){
            throw new HttpException('缺少参数bucketName',400)
        }
        if(!fileName){
            throw new HttpException('缺少参数fileName',400)
        }
        return true
    }
}