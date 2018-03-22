import {MiddlewaresConsumer, NestModule, RequestMethod} from "@nestjs/common";
import {CqrsModule} from "./cqrsCms/cqrs.module";
import {RegistrationModule} from "./enter/registration.module";
import {LocalModule} from "./ext-local-store/src/LocalModule";
import {graphiqlExpress,graphqlExpress} from "apollo-server-express";
import {GraphQLFactory,GraphQLModule} from "@nestjs/graphql";

import { Module } from "@notadd/injection";
import {TypeOrmModule} from "@nestjs/typeorm";
@Module({
    authors: [
        {
            email: "admin@notadd.com",
            username: "notadd",
        },
    ],
    identification: "module-demo",
    name: "Module Demo",
    version: "2.0.0",
    imports :[
        GraphQLModule,
        CqrsModule,
        LocalModule,
        RegistrationModule,
        TypeOrmModule.forRoot()
    ],
})

export class CmsModule implements NestModule {
    constructor(private readonly graphqlFactory:GraphQLFactory){}
    //中间件设置
    configure(consumer:MiddlewaresConsumer){
        const schema =this.createSchema();
        consumer.apply(graphiqlExpress({ endpointURL: '/graphql' }))
            .forRoutes({ path: '/graphiql', method: RequestMethod.GET })
            .apply(graphqlExpress(req => ({ schema, rootValue: req })))
            .forRoutes({ path: '/graphql', method: RequestMethod.ALL })

    }
    createSchema() {
        const typeDefs = this.graphqlFactory.mergeTypesByPaths('./**/*.graphql');
        const schema = this.graphqlFactory.createSchema({ typeDefs });
        return schema;
    }
}