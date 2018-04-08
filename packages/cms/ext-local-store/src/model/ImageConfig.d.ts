import { Bucket } from './Bucket';
export declare class ImageConfig {
    id: number;
    format: string;
    watermark_enable: number;
    watermark_save_key: string;
    watermark_gravity: string;
    watermark_x: number;
    watermark_y: number;
    watermark_opacity: number;
    watermark_ws: number;
    bucket?: Bucket;
}
