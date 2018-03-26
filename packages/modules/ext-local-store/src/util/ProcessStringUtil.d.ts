import { ImagePostProcessInfo, ImagePreProcessInfo } from '../interface/file/ImageProcessInfo';
import { Bucket } from '../model/Bucket.entity';
import { KindUtil } from './KindUtil';
export declare class ProcessStringUtil {
    private readonly kindUtil;
    private readonly gravity;
    constructor(kindUtil: KindUtil);
    makeImageProcessString(bucket: Bucket, imageProcessInfo: ImagePostProcessInfo | ImagePreProcessInfo): string;
    resizeString(resize: any): string;
    tailorString(tailor: any): string;
    watermarkString(watermark: boolean, bucket: Bucket): string;
    rotateString(rotate: number): string;
    blurString(blur: any): string;
    outputString(sharpen: boolean, format: string, lossless: boolean, quality: number, progressive: boolean, strip: boolean): string;
}
