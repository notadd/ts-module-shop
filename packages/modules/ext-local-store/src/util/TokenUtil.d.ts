import { Bucket } from '../model/Bucket.entity';
export declare class TokenUtil {
    constructor();
    getToken(url: string, bucket: Bucket): string;
    verify(url: string, bucket: Bucket, token: string): void;
}
