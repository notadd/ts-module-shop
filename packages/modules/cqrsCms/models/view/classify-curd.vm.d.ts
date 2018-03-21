import { ClassifyEntity } from "../../../entity/classify.entity";
import { PageClassifyEntity } from "../../../entity/pageClassify.entity";
export declare class ClassifyCurdVm {
    useFor: string;
    createClassify?: {
        art?: ClassifyEntity;
        page?: PageClassifyEntity;
    };
    updateClassify?: {
        art?: ClassifyEntity;
        page?: PageClassifyEntity;
    };
    deleteClassify?: number;
    mobileClassifyId?: {
        id: number;
        parentId: number;
    };
    getAllClassify?: boolean;
    getClassifyById?: {
        id: number;
        useFor: string;
    };
}
