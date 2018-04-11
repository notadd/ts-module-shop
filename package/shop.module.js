"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const goods_property_resolver_1 = require("./resolver/goods.property.resolver");
const property_value_resolver_1 = require("./resolver/property.value.resolver");
const property_value_service_1 = require("./service/property.value.service");
const goods_property_service_1 = require("./service/goods.property.service");
const goods_type_resolver_1 = require("./resolver/goods.type.resolver");
const classify_resolver_1 = require("./resolver/classify.resolver");
const second_classify_entity_1 = require("./model/second.classify.entity");
const goods_type_service_1 = require("./service/goods.type.service");
const first_classify_entity_1 = require("./model/first.classify.entity");
const third_classify_entity_1 = require("./model/third.classify.entity");
const goods_property_entity_1 = require("./model/goods.property.entity");
const property_value_entity_1 = require("./model/property.value.entity");
const classify_service_1 = require("./service/classify.service");
const goods_resolver_1 = require("./resolver/goods.resolver");
const brand_resolver_1 = require("./resolver/brand.resolver");
const goods_service_1 = require("./service/goods.service");
const brand_service_1 = require("./service/brand.service");
const goods_type_entity_1 = require("./model/goods.type.entity");
const typeorm_1 = require("@nestjs/typeorm");
const brand_entity_1 = require("./model/brand.entity");
const goods_entity_1 = require("./model/goods.entity");
const common_1 = require("@nestjs/common");
let ShopModule = class ShopModule {
};
ShopModule = __decorate([
    common_1.Module({
        modules: [typeorm_1.TypeOrmModule.forFeature([first_classify_entity_1.FirstClassify, second_classify_entity_1.SecondClassify, third_classify_entity_1.ThirdClassify, goods_entity_1.Goods, goods_type_entity_1.GoodsType, goods_property_entity_1.GoodsProperty, property_value_entity_1.PropertyValue, brand_entity_1.Brand])],
        components: [
            goods_service_1.GoodsService, goods_resolver_1.GoodsResolver,
            brand_service_1.BrandService, brand_resolver_1.BrandResolver,
            classify_service_1.ClassifyService, classify_resolver_1.ClassifyResolver,
            goods_type_service_1.GoodsTypeService, goods_type_resolver_1.GoodsTypeResolver,
            goods_property_service_1.GoodsPropertyService, goods_property_resolver_1.GoodsPropertyResolver,
            property_value_service_1.PropertyValueService, property_value_resolver_1.PropertyValueResolver
        ],
        controllers: [],
        exports: []
    })
], ShopModule);
exports.ShopModule = ShopModule;
//# sourceMappingURL=shop.module.js.map