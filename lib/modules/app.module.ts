import { Module} from "@nestjs/common";
import {MiddlewaresConsumer} from "@nestjs/common";
import {graphiqlExpress,graphqlExpress} from "apollo-server-express";
import {RequestMethod} from "@nestjs/common";
import {GraphQLFactory,GraphQLModule} from "@nestjs/graphql";
import {NestModule} from "@nestjs/common";
import {CqrsModule} from "./cqrsCms/cqrs.module";
import {LocalModule} from "./ext-local-store/src/LocalModule";
import {RegistrationModule} from "./enter/registration.module";

@Module({
    modules :[GraphQLModule,CqrsModule,LocalModule,RegistrationModule],
})

export class ApplicationModule implements NestModule{
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
