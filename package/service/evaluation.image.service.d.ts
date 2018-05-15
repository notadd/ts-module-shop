/// <reference types="express" />
import { OutEvaluationImage } from "../interface/evaluationimage/evaluation.images.data";
import { EvaluationImage } from "../model/evaluation.image.entity";
import { StoreComponent } from "../interface/store.component";
import { Evaluation } from "../model/evaluation.entity";
import { Repository } from "typeorm";
import { Request } from "express";
export declare class EvaluationImageService {
    private readonly storeComponent;
    private readonly evaluationRepository;
    private readonly evaluationImageRepository;
    constructor(storeComponent: StoreComponent, evaluationRepository: Repository<Evaluation>, evaluationImageRepository: Repository<EvaluationImage>);
    getEvaluationImages(req: Request, evaluationId: number): Promise<Array<OutEvaluationImage>>;
    createEvaluationImage(evaluationId: number, bucketName: string, rawName: string, base64: string): Promise<void>;
    deleteEvaluationImage(id: number): Promise<void>;
}
