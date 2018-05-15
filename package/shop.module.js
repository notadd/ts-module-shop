"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_receiving_information_resolver_1 = require("./resolver/user.receiving.information.resolver");
const user_receiving_information_service_1 = require("./service/user.receiving.information.service");
const user_receiving_information_entity_1 = require("./model/user.receiving.information.entity");
const evaluation_image_resolver_1 = require("./resolver/evaluation.image.resolver");
const evaluation_image_service_1 = require("./service/evaluation.image.service");
const goods_property_resolver_1 = require("./resolver/goods.property.resolver");
const property_value_resolver_1 = require("./resolver/property.value.resolver");
const store_setting_resolver_1 = require("./resolver/store.setting.resolver");
const shop_component_provider_1 = require("./export/shop.component.provider");
const property_value_service_1 = require("./service/property.value.service");
const goods_property_service_1 = require("./service/goods.property.service");
const store_setting_service_1 = require("./service/store.setting.service");
const goods_image_resolver_1 = require("./resolver/goods.image.resolver");
const pay_setting_resolver_1 = require("./resolver/pay.setting.resolver");
const evaluation_resolver_1 = require("./resolver/evaluation.resolver");
const goods_type_resolver_1 = require("./resolver/goods.type.resolver");
const order_item_resolver_1 = require("./resolver/order.item.resolver");
const evaluation_image_entity_1 = require("./model/evaluation.image.entity");
const pay_setting_service_1 = require("./service/pay.setting.service");
const goods_image_service_1 = require("./service/goods.image.service");
const evaluation_service_1 = require("./service/evaluation.service");
const order_item_service_1 = require("./service/order.item.service");
const classify_resolver_1 = require("./resolver/classify.resolver");
const second_classify_entity_1 = require("./model/second.classify.entity");
const goods_type_service_1 = require("./service/goods.type.service");
const delivery_resolver_1 = require("./resolver/delivery.resolver");
const first_classify_entity_1 = require("./model/first.classify.entity");
const third_classify_entity_1 = require("./model/third.classify.entity");
const goods_property_entity_1 = require("./model/goods.property.entity");
const property_value_entity_1 = require("./model/property.value.entity");
const delivery_service_1 = require("./service/delivery.service");
const classify_service_1 = require("./service/classify.service");
const member_resolver_1 = require("./resolver/member.resolver");
const store_setting_entity_1 = require("./model/store.setting.entity");
const goods_resolver_1 = require("./resolver/goods.resolver");
const brand_resolver_1 = require("./resolver/brand.resolver");
const order_resolver_1 = require("./resolver/order.resolver");
const floor_resolver_1 = require("./resolver/floor.resolver");
const member_service_1 = require("./service/member.service");
const pay_setting_entity_1 = require("./model/pay.setting.entity");
const goods_image_entity_1 = require("./model/goods.image.entity");
const evaluation_entity_1 = require("./model/evaluation.entity");
const goods_service_1 = require("./service/goods.service");
const brand_service_1 = require("./service/brand.service");
const order_service_1 = require("./service/order.service");
const floor_service_1 = require("./service/floor.service");
const goods_type_entity_1 = require("./model/goods.type.entity");
const brand_logo_entity_1 = require("./model/brand.logo.entity");
const sku_resolver_1 = require("./resolver/sku.resolver");
const order_item_entity_1 = require("./model/order.item.entity");
const delivery_entity_1 = require("./model/delivery.entity");
const sku_service_1 = require("./service/sku.service");
const typeorm_1 = require("@nestjs/typeorm");
const random_util_1 = require("./util/random.util");
const member_entity_1 = require("./model/member.entity");
const floor_entity_1 = require("./model/floor.entity");
const brand_entity_1 = require("./model/brand.entity");
const goods_entity_1 = require("./model/goods.entity");
const order_entity_1 = require("./model/order.entity");
const date_util_1 = require("./util/date.util");
const user_1 = require("@notadd/user");
const sku_entity_1 = require("./model/sku.entity");
const common_1 = require("@nestjs/common");
let ShopModule = class ShopModule {
};
ShopModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([
                evaluation_entity_1.Evaluation, evaluation_image_entity_1.EvaluationImage,
                store_setting_entity_1.StoreSetting, pay_setting_entity_1.PaySetting, member_entity_1.Member, floor_entity_1.Floor,
                first_classify_entity_1.FirstClassify, second_classify_entity_1.SecondClassify, third_classify_entity_1.ThirdClassify,
                goods_entity_1.Goods, goods_type_entity_1.GoodsType, goods_image_entity_1.GoodsImage, goods_property_entity_1.GoodsProperty, property_value_entity_1.PropertyValue,
                brand_entity_1.Brand, brand_logo_entity_1.BrandLogo, sku_entity_1.Sku, order_entity_1.Order, order_item_entity_1.OrderItem, delivery_entity_1.Delivery, user_receiving_information_entity_1.UserReceivingInformation
            ]), user_1.UserModule],
        providers: [
            date_util_1.DateUtil, random_util_1.RandomUtil,
            sku_service_1.SkuService, sku_resolver_1.SkuResolver,
            floor_service_1.FloorService, floor_resolver_1.FloorResolver,
            order_service_1.OrderService, order_resolver_1.OrderResolver,
            goods_service_1.GoodsService, goods_resolver_1.GoodsResolver,
            brand_service_1.BrandService, brand_resolver_1.BrandResolver,
            member_service_1.MemberService, member_resolver_1.MemberResolver,
            delivery_service_1.DeliveryService, delivery_resolver_1.DeliveryResolver,
            classify_service_1.ClassifyService, classify_resolver_1.ClassifyResolver,
            goods_type_service_1.GoodsTypeService, goods_type_resolver_1.GoodsTypeResolver,
            order_item_service_1.OrderItemService, order_item_resolver_1.OrderItemResolver,
            goods_image_service_1.GoodsImageService, goods_image_resolver_1.GoodsImageResolver,
            pay_setting_service_1.PaySettingService, pay_setting_resolver_1.PaySettingResolver,
            evaluation_service_1.EvaluationService, evaluation_resolver_1.EvaluationResolver,
            store_setting_service_1.StoreSettingService, store_setting_resolver_1.StoreSettingResolver,
            goods_property_service_1.GoodsPropertyService, goods_property_resolver_1.GoodsPropertyResolver,
            property_value_service_1.PropertyValueService, property_value_resolver_1.PropertyValueResolver,
            evaluation_image_service_1.EvaluationImageService, evaluation_image_resolver_1.EvaluationImageResolver,
            user_receiving_information_service_1.UserReceivingInformationService, user_receiving_information_resolver_1.UserReceivingInformationResolver,
            shop_component_provider_1.ShopComponentProvider
        ],
        controllers: [],
        exports: [shop_component_provider_1.ShopComponentProvider]
    })
], ShopModule);
exports.ShopModule = ShopModule;

//# sourceMappingURL=shop.module.js.map
