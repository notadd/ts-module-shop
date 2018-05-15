import { Evaluation } from "./evaluation.entity";
export declare class EvaluationImage {
    id: number;
    bucketName: string;
    name: string;
    type: string;
    evaluationId: number;
    evaluation: Evaluation;
}
