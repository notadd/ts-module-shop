import { ICommandHandler } from "@nestjs/cqrs";
import { PageService } from "../../service/page.service";
import { GetPageParamCommand } from "../impl/get-page-param.command";
export declare class GetPageHandler implements ICommandHandler<GetPageParamCommand> {
    private readonly pageService;
    constructor(pageService: PageService);
    execute(command: GetPageParamCommand, resolver: (value) => void): Promise<void>;
}
