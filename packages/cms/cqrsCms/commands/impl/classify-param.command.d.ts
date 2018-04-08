import { ClassifyCurdVm } from "../../models/view/classify-curd.vm";
import { ICommand } from "@nestjs/cqrs";
export declare class ClassifyParamCommand implements ICommand {
    classify: ClassifyCurdVm;
    constructor(classify: ClassifyCurdVm);
}
