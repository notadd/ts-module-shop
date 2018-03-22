import { Bucket } from './Bucket.entity';
export declare class VideoConfig {
    id: number;
    format: string;
    resolution: string;
    bucket?: Bucket;
}
