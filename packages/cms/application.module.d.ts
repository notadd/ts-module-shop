import { GraphQLFactory } from "@nestjs/graphql";
import { MiddlewaresConsumer, NestModule } from "@nestjs/common";
export declare class ApplicationModule implements NestModule {
    private readonly graphqlFactory;
    constructor(graphqlFactory: GraphQLFactory);
    K: any;
    configure(consumer: MiddlewaresConsumer): void;
    createSchema(): any;
}