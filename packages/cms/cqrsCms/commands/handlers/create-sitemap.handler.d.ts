import { EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { CreateParamCommand } from "../impl/create-param.command";
import { PageRepository } from "../../repository/pageRepository";
export declare class CreateSitemapHandler implements ICommandHandler<CreateParamCommand> {
    private readonly repositoty;
    private readonly publisher;
    constructor(repositoty: PageRepository, publisher: EventPublisher);
    execute(command: CreateParamCommand, resolver: (value?) => void): Promise<void>;
}
