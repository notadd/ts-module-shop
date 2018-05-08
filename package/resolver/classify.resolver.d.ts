/// <reference types="express" />
import { ClassifyService } from "../service/classify.service";
import { Classify } from "../interface/classify/classify";
import { Data } from "../interface/data";
import { Request } from "express";
export declare class ClassifyResolver {
    private readonly classifyService;
    constructor(classifyService: ClassifyService);
    classifies(req: Request, body: {
        parentId: number;
        level: 1 | 2 | 3;
    }): Promise<Data & {
        classifies: Array<Classify>;
    }>;
    classify(req: Request, body: {
        id: number;
        level: 1 | 2 | 3;
    }): Promise<Data & {
        classify: Classify;
    }>;
    createClassify(req: Request, body: {
        name: string;
        description: string;
        level: 1 | 2 | 3;
        parentId: number;
    }): Promise<Data>;
    updateClassify(req: Request, body: {
        id: number;
        name: string;
        description: string;
        level: 1 | 2 | 3;
    }): Promise<Data>;
    deleteClassify(req: Request, body: {
        id: number;
        level: 1 | 2 | 3;
    }): Promise<Data>;
}
