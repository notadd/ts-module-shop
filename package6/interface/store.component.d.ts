/// <reference types="express" />
import { Request } from "express";
export interface StoreComponent {
    delete(bucketName: string, name: string, type: string): Promise<void>;
    upload(bucketName: string, rawName: string, base64: string, imagePreProcessInfo: any): Promise<{
        bucketName: string;
        name: string;
        type: string;
    }>;
    getUrl(req: Request, bucketName: string, name: string, type: string, imageProcessInfo: ImageProcessInfo): Promise<string>;
}
export interface ImageProcessInfo {
    resize: {
        mode: string;
        data: {
            width: number;
            height: number;
        };
    };
    watermark: boolean;
}
