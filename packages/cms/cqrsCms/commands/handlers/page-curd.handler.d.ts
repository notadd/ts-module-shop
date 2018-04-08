import { EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { PageRepository } from "../../repository/pageRepository";
import { PageParamCommand } from "../impl/page-param.command";
import { PageService } from "../../service/page.service";
export declare class CreatePageHandler implements ICommandHandler<PageParamCommand> {
    private readonly repositoty;
    private readonly publisher;
    private readonly pageService;
    constructor(repositoty: PageRepository, publisher: EventPublisher, pageService: PageService);
    execute(command: PageParamCommand, resolver: (value?) => void): Promise<any>;
}
