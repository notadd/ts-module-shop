/// <reference types="express" />
import { InputEvaluationImage } from "../interface/evaluation/input.evaluation.image";
import { EvaluationService } from "../service/evaluation.service";
import { Data } from "../interface/data";
import { Request } from "express";
export declare class EvaluationResolver {
    private readonly evaluationService;
    constructor(evaluationService: EvaluationService);
    evaluation(req: Request, body: {
        id: number;
    }): Promise<any>;
    evaluations(req: Request, body: {
        goodsId: number;
    }): Promise<any>;
    createEvaluation(req: Request, body: {
        content: string;
        userId: number;
        orderItemId: number;
        inputImages: Array<InputEvaluationImage>;
    }): Promise<Data>;
    updateEvaluation(req: Request, body: {
        id: number;
        content: string;
        display: boolean;
    }): Promise<Data>;
    deleteEvaluation(req: Request, body: {
        id: number;
    }): Promise<Data>;
}
