export interface EvaluationImagesData {
    code: number;
    message: string;
    images: Array<OutEvaluationImage>;
}

export interface OutEvaluationImage {
    id: number;
    bucketName: string;
    name: string;
    type: string;
    url: string;
}
