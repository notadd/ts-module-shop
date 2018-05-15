/// <reference types="express" />
import { EvaluationImagesData } from "../interface/evaluationimage/evaluation.images.data";
import { EvaluationImageService } from "../service/evaluation.image.service";
import { Data } from "../interface/data";
import { Request } from "express";
export declare class EvaluationImageResolver {
    private readonly evaluationImageService;
    constructor(evaluationImageService: EvaluationImageService);
    evaluationImages(req: Request, body: {
        evaluationId: number;
    }): Promise<EvaluationImagesData>;
    createEvaluationImage(req: Request, body: {
        evaluationId: number;
        bucketName: string;
        rawName: string;
        base64: string;
    }): Promise<Data>;
    deleteEvaluationImage(req: Request, body: {
        id: number;
    }): Promise<Data>;
}
