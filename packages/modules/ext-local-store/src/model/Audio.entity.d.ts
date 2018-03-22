import { AbstractFile } from './AbstractFile';
import { Bucket } from './Bucket.entity';
export declare class Audio extends AbstractFile {
    bucketId: number;
    bucket: Bucket;
}
