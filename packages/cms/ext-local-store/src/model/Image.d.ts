import { AbstractFile } from './AbstractFile';
import { Bucket } from './Bucket';
export declare class Image extends AbstractFile {
    width: number;
    height: number;
    bucketId: number;
    bucket: Bucket;
}
