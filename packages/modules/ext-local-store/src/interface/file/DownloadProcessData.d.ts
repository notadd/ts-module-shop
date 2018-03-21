export interface DownloadProcessData {
    code: number;
    message: string;
    method: string;
    headers: {
        bucketName: string;
        fileName: string;
    };
    url: string;
}
