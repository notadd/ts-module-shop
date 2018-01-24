import { Module, NestModule} from "@nestjs/common";
import {MiddlewaresConsumer} from "@nestjs/common";
import {graphqlExpress,graphiqlExpress} from "apollo-server-express";
import {RequestMethod} from "@nestjs/common";
import {GraphQLFactory,GraphQLModule} from "@nestjs/graphql";
import {ArticleModule} from "./article/article.module";
import {ClassifyModule} from "./classify/classify.module";
import {HistoryModule} from "./history/history.module";
import {PageModule} from "./page/page.module";
import {GraphqlModule} from "./graphql/graphql.module";

@Module({
    modules :[GraphQLModule,ArticleModule,ClassifyModule,GraphqlModule,PageModule],
})

export class ApplicationModule implements NestModule{
    constructor(private readonly graphqlFactory:GraphQLFactory){}
    //中间件设置
    configure(consumer:MiddlewaresConsumer){
        const schema =this.createSchema();
       // console.log('schema='+JSON.stringify(schema));
        consumer.apply(graphiqlExpress({ endpointURL: '/graphql' }))
            .forRoutes({ path: '/graphiql', method: RequestMethod.GET })
            .apply(graphqlExpress(req => ({ schema, rootValue: req })))
            .forRoutes({ path: '/graphql', method: RequestMethod.ALL });
    }
     createSchema() {
         const typeDefs = this.graphqlFactory.mergeTypesByPaths('./**/*.graphql');
         const schema = this.graphqlFactory.createSchema({ typeDefs });
         return schema;
     }
}
