import { CmsModule } from "./cms.injection";
import { GraphQLFactory, GraphQLModule } from "@nestjs/graphql";
import { graphiqlExpress, graphqlExpress } from "apollo-server-express";
import { MiddlewaresConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        CmsModule,
        GraphQLModule,
        TypeOrmModule.forRoot(),
    ],
})
export class ApplicationModule implements NestModule {
    constructor(private readonly graphqlFactory: GraphQLFactory) {
    }

    //中间件设置
    configure(consumer: MiddlewaresConsumer) {
        const schema = this.createSchema();
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
