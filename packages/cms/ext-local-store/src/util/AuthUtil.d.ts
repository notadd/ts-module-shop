import { Bucket } from '../model/Bucket.entity';
export declare class AuthUtil {
    constructor();
    getHeaderAuth(bucket: Bucket, method: string, url: string, date: string, md5: string): Promise<string>;
    getBodyAuth(bucket: Bucket, method: string, policy: any): Promise<string>;
    getToken(bucket: Bucket, url: string): Promise<any>;
    notifyVerify(auth: string, bucket: Bucket, method: string, url: string, date: string, contentMd5: string, body: any): Promise<boolean>;
    taskNotifyVerify(auth: string, bucket: Bucket, method: string, url: string, date: string, contentMd5: string, body: any): Promise<boolean>;
}
