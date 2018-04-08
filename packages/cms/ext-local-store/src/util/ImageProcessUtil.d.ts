/// <reference types="node" />
/// <reference types="sharp" />
import { ImagePostProcessInfo, ImagePreProcessInfo, Resize, Tailor, Blur } from '../interface/file/ImageProcessInfo';
import { ImageMetadata } from '../interface/file/ImageMetadata';
import { Bucket } from '../model/Bucket.entity';
import { KindUtil } from './KindUtil';
import { FileUtil } from './FileUtil';
import { SharpInstance } from 'sharp';
export declare class ImageProcessUtil {
    private readonly kindUtil;
    private readonly fileUtil;
    private readonly gravity;
    constructor(kindUtil: KindUtil, fileUtil: FileUtil);
    getMetadata(pathOrBuffer: string | Buffer): Promise<ImageMetadata>;
    processAndStore(imagePath: string, bucket: Bucket, imageProcessInfo: ImagePostProcessInfo | ImagePreProcessInfo): Promise<ImageMetadata>;
    processAndOutput(bucket: Bucket, imagePath: string, imageProcessInfo: ImagePostProcessInfo | ImagePreProcessInfo): Promise<Buffer>;
    preProcess(imagePath: string, bucket: Bucket, imageProcessInfo: ImagePreProcessInfo): Promise<Buffer>;
    postProcess(imagePath: string, bucket: Bucket, imageProcessInfo: ImagePostProcessInfo): Promise<Buffer>;
    resize(instance: SharpInstance, resize: Resize, preWidth: number, preHeight: number): any;
    tailor(instance: SharpInstance, tailor: Tailor, preWidth: number, preHeight: number): any;
    watermark(bucket: Bucket, instance: SharpInstance, metadata: ImageMetadata, watermark: boolean, preWidth: number, preHeight: number): Promise<string>;
    rotate(instance: SharpInstance, metadata: ImageMetadata, rotate: number, width: number, height: number): Promise<string>;
    blur(instance: SharpInstance, blur: Blur): void;
    sharpen(instance: SharpInstance, sharpen: boolean): void;
    format(instance: SharpInstance, format: string): void;
    strip(instance: SharpInstance, strip: boolean): void;
    output(instance: SharpInstance, format: string, lossless: boolean, quality: number, progressive: boolean): void;
}
