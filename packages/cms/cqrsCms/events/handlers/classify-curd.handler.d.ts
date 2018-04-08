import { IEventHandler } from "@nestjs/cqrs";
import { ClassifyCurdEvents } from "../impl/classify-curd.events";
import { ClassifyService } from "../../service/classify.service";
export declare class ClassifyCurdEvent implements IEventHandler<ClassifyCurdEvents> {
    readonly classifyservice: ClassifyService;
    constructor(classifyservice: ClassifyService);
    handle(event: ClassifyCurdEvents): Promise<void>;
}
