export interface GoodsImageData {
    code: number;
    message: string;
    images: Array<{
        id: number;
        bucketName: string;
        name: string;
        type: string;
        url: string;
    }>;
}