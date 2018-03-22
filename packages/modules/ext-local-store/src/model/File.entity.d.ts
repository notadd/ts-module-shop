import { AbstractFile } from './AbstractFile';
import { Bucket } from './Bucket.entity';
export declare class File extends AbstractFile {
    bucketId: number;
    bucket: Bucket;
}
