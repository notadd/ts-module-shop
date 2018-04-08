import { AbstractFile } from './AbstractFile';
import { Bucket } from './Bucket.entity';
export declare class Document extends AbstractFile {
    bucketId: number;
    bucket: Bucket;
}
