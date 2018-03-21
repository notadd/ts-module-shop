import {ICommand} from "@nestjs/cqrs";

export class DeleteParamCommand implements ICommand {
    constructor(public readonly heroId: string, public readonly itemId: string) {}
}