import { AbstractFile } from './AbstractFile';
import { Bucket } from './Bucket.entity';
export declare class Video extends AbstractFile {
    bucketId: number;
    bucket: Bucket;
}
