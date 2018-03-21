import { ICommandHandler } from "@nestjs/cqrs";
import { GetClassifyParamCommand } from "../impl/get-classify-param.command";
import { ClassifyService } from "../../service/classify.service";
export declare class GetClassifyHandler implements ICommandHandler<GetClassifyParamCommand> {
    private readonly classifyService;
    constructor(classifyService: ClassifyService);
    execute(command: GetClassifyParamCommand, resolver: (value) => void): Promise<void>;
}
