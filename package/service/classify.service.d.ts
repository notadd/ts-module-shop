import { SecondClassify } from "../model/second.classify.entity";
import { FirstClassify } from "../model/first.classify.entity";
import { ThirdClassify } from "../model/third.classify.entity";
import { Classify } from "../interface/classify/classify";
import { Repository } from "typeorm";
export declare class ClassifyService {
    private readonly firstClassifyRepository;
    private readonly secondClassifyRepository;
    private readonly thirdClassifyRepository;
    constructor(firstClassifyRepository: Repository<FirstClassify>, secondClassifyRepository: Repository<SecondClassify>, thirdClassifyRepository: Repository<ThirdClassify>);
    getClassifes(parentId: number, level: number): Promise<Array<Classify>>;
    getClassify(id: number, level: number): Promise<Classify | undefined>;
    createClassify(name: string, description: string, level: number, parentId: number): Promise<void>;
    updateClassify(id: number, name: string, description: string, level: number): Promise<void>;
    deleteClassify(id: number, level: number): Promise<void>;
}
