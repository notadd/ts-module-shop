"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const cqrs_module_1 = require("./cqrsCms/cqrs.module");
const registration_module_1 = require("./enter/registration.module");
const LocalModule_1 = require("./ext-local-store/src/LocalModule");
const apollo_server_express_1 = require("apollo-server-express");
const graphql_1 = require("@nestjs/graphql");
const injection_1 = require("@notadd/injection");
const typeorm_1 = require("@nestjs/typeorm");
let CmsModule = class CmsModule {
    constructor(graphqlFactory) {
        this.graphqlFactory = graphqlFactory;
    }
    configure(consumer) {
        const schema = this.createSchema();
        consumer.apply(apollo_server_express_1.graphiqlExpress({ endpointURL: '/graphql' }))
            .forRoutes({ path: '/graphiql', method: common_1.RequestMethod.GET })
            .apply(apollo_server_express_1.graphqlExpress(req => ({ schema, rootValue: req })))
            .forRoutes({ path: '/graphql', method: common_1.RequestMethod.ALL });
    }
    createSchema() {
        const typeDefs = this.graphqlFactory.mergeTypesByPaths('./**/*.graphql');
        const schema = this.graphqlFactory.createSchema({ typeDefs });
        return schema;
    }
};
CmsModule = __decorate([
    injection_1.Module({
        authors: [
            {
                email: "admin@notadd.com",
                username: "notadd",
            },
            {
                email: "1945320167@qq.com",
                username: "EricAll",
            },
        ],
        identification: "module-cms",
        name: "Module CMS",
        version: "2.0.2",
        imports: [
            graphql_1.GraphQLModule,
            cqrs_module_1.CqrsModule,
            LocalModule_1.LocalModule,
            registration_module_1.RegistrationModule,
            typeorm_1.TypeOrmModule.forRoot()
        ],
    }),
    __metadata("design:paramtypes", [graphql_1.GraphQLFactory])
], CmsModule);
exports.CmsModule = CmsModule;
