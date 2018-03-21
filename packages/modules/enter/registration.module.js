"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const registration_service_1 = require("./registration.service");
const graphql_resolver_1 = require("./graphql.resolver");
const typeorm_1 = require("@nestjs/typeorm");
const site_entity_1 = require("../entity/site.entity");
const block_entity_1 = require("../entity/block.entity");
const visit_entity_1 = require("../entity/visit.entity");
const common_paging_1 = require("../export/common.paging");
let RegistrationModule = class RegistrationModule {
};
RegistrationModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([site_entity_1.SiteEntity, block_entity_1.BlockEntity, visit_entity_1.VisitEntity])],
        components: [registration_service_1.RegistrationService, graphql_resolver_1.EnterResolver, common_paging_1.PagerService]
    })
], RegistrationModule);
exports.RegistrationModule = RegistrationModule;
