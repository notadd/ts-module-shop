import { MiddlewaresConsumer } from "@nestjs/common";
import { GraphQLFactory } from "@nestjs/graphql";
import { NestModule } from "@nestjs/common";
export declare class CmsModule implements NestModule {
    private readonly graphqlFactory;
    constructor(graphqlFactory: GraphQLFactory);
    configure(consumer: MiddlewaresConsumer): void;
    createSchema(): any;
}
