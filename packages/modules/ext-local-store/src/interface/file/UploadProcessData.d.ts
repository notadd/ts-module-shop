export interface UploadProcessData {
    code: number;
    message: string;
    method: string;
    url: string;
    baseUrl: string;
    form: {
        imagePreProcessString?: string;
        contentSecret?: string;
        tagsString?: string;
        bucketName: string;
        rawName: string;
        md5: string;
    };
}
