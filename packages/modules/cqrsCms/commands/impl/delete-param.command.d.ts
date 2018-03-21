import { ICommand } from "@nestjs/cqrs";
export declare class DeleteParamCommand implements ICommand {
    readonly heroId: string;
    readonly itemId: string;
    constructor(heroId: string, itemId: string);
}
