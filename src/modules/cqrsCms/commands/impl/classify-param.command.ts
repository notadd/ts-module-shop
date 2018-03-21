import {ClassifyCurdVm} from "../../models/view/classify-curd.vm";
import {ICommand} from "@nestjs/cqrs";

export class ClassifyParamCommand implements ICommand{
    constructor(public classify:ClassifyCurdVm){}
}