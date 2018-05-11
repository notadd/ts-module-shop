import "reflect-metadata";
import { Module, MiddlewaresConsumer, NestModule, Inject, RequestMethod } from "@nestjs/common";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { GraphQLModule, GraphQLFactory } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShopModule } from "../src/shop.module";
import { LocalModule } from "@notadd/addon-local";

@Module({
  modules: [GraphQLModule, ShopModule, LocalModule, TypeOrmModule.forRoot({
    name: "shop",
    type: "postgres",
    host: "localhost",
    port: 5433,
    username: "postgres",
    password: "123456",
    database: "postgres",
    entities: ["./**/*.entity.ts", "./**/*.entity.js"],
    logger: "simple-console",
    logging: false,
    synchronize: true,
    dropSchema: false
  })],
  controllers: []
})

export class ApplicationModule implements NestModule {

  constructor(
    @Inject(GraphQLFactory) private readonly graphQLFactory: GraphQLFactory,
  ) { }

  configure(consumer: MiddlewaresConsumer) {
    const typeDefs = this.graphQLFactory.mergeTypesByPaths("./**/*.types.graphql");
    const schema = this.graphQLFactory.createSchema({ typeDefs });
    consumer
      .apply(graphiqlExpress({ endpointURL: "/graphql" }))
      .forRoutes({ path: "/graphiql", method: RequestMethod.GET })
      .apply(graphqlExpress(req => ({ schema, rootValue: req })))
      .forRoutes({ path: "/graphql", method: RequestMethod.ALL });
  }

}
