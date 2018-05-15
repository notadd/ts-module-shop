import { UserReceivingInformationResolver } from "./resolver/user.receiving.information.resolver";
import { UserReceivingInformationService } from "./service/user.receiving.information.service";
import { UserReceivingInformation } from "./model/user.receiving.information.entity";
import { EvaluationImageResolver } from "./resolver/evaluation.image.resolver";
import { EvaluationImageService } from "./service/evaluation.image.service";
import { GoodsPropertyResolver } from "./resolver/goods.property.resolver";
import { PropertyValueResolver } from "./resolver/property.value.resolver";
import { StoreSettingResolver } from "./resolver/store.setting.resolver";
import { ShopComponentProvider } from "./export/shop.component.provider";
import { PropertyValueService } from "./service/property.value.service";
import { GoodsPropertyService } from "./service/goods.property.service";
import { StoreSettingService } from "./service/store.setting.service";
import { GoodsImageResolver } from "./resolver/goods.image.resolver";
import { PaySettingResolver } from "./resolver/pay.setting.resolver";
import { EvaluationResolver } from "./resolver/evaluation.resolver";
import { GoodsTypeResolver } from "./resolver/goods.type.resolver";
import { OrderItemResolver } from "./resolver/order.item.resolver";
import { EvaluationImage } from "./model/evaluation.image.entity";
import { PaySettingService } from "./service/pay.setting.service";
import { GoodsImageService } from "./service/goods.image.service";
import { EvaluationService } from "./service/evaluation.service";
import { OrderItemService } from "./service/order.item.service";
import { ClassifyResolver } from "./resolver/classify.resolver";
import { SecondClassify } from "./model/second.classify.entity";
import { GoodsTypeService } from "./service/goods.type.service";
import { DeliveryResolver } from "./resolver/delivery.resolver";
import { FirstClassify } from "./model/first.classify.entity";
import { ThirdClassify } from "./model/third.classify.entity";
import { GoodsProperty } from "./model/goods.property.entity";
import { PropertyValue } from "./model/property.value.entity";
import { DeliveryService } from "./service/delivery.service";
import { ClassifyService } from "./service/classify.service";
import { MemberResolver } from "./resolver/member.resolver";
import { StoreSetting } from "./model/store.setting.entity";
import { GoodsResolver } from "./resolver/goods.resolver";
import { BrandResolver } from "./resolver/brand.resolver";
import { OrderResolver } from "./resolver/order.resolver";
import { FloorResolver } from "./resolver/floor.resolver";
import { MemberService } from "./service/member.service";
import { PaySetting } from "./model/pay.setting.entity";
import { GoodsImage } from "./model/goods.image.entity";
import { Evaluation } from "./model/evaluation.entity";
import { GoodsService } from "./service/goods.service";
import { BrandService } from "./service/brand.service";
import { OrderService } from "./service/order.service";
import { FloorService } from "./service/floor.service";
import { GoodsType } from "./model/goods.type.entity";
import { BrandLogo } from "./model/brand.logo.entity";
import { SkuResolver } from "./resolver/sku.resolver";
import { OrderItem } from "./model/order.item.entity";
import { Delivery } from "./model/delivery.entity";
import { SkuService } from "./service/sku.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RandomUtil } from "./util/random.util";
import { Member } from "./model/member.entity";
import { Floor } from "./model/floor.entity";
import { Brand } from "./model/brand.entity";
import { Goods } from "./model/goods.entity";
import { Order } from "./model/order.entity";
import { DateUtil } from "./util/date.util";
import { UserModule } from "@notadd/user";
import { Sku } from "./model/sku.entity";
import { Module } from "@nestjs/common";

@Module({
    imports: [TypeOrmModule.forFeature([
        Evaluation, EvaluationImage,
        StoreSetting, PaySetting, Member, Floor,
        FirstClassify, SecondClassify, ThirdClassify,
        Goods, GoodsType, GoodsImage, GoodsProperty, PropertyValue,
        Brand, BrandLogo, Sku, Order, OrderItem, Delivery, UserReceivingInformation
    ]), UserModule],
    providers: [
        DateUtil, RandomUtil,
        SkuService, SkuResolver,
        FloorService, FloorResolver,
        OrderService, OrderResolver,
        GoodsService, GoodsResolver,
        BrandService, BrandResolver,
        MemberService, MemberResolver,
        DeliveryService, DeliveryResolver,
        ClassifyService, ClassifyResolver,
        GoodsTypeService, GoodsTypeResolver,
        OrderItemService, OrderItemResolver,
        GoodsImageService, GoodsImageResolver,
        PaySettingService, PaySettingResolver,
        EvaluationService, EvaluationResolver,
        StoreSettingService, StoreSettingResolver,
        GoodsPropertyService, GoodsPropertyResolver,
        PropertyValueService, PropertyValueResolver,
        EvaluationImageService, EvaluationImageResolver,
        UserReceivingInformationService, UserReceivingInformationResolver,
        ShopComponentProvider
    ],
    controllers: [],
    exports: [ShopComponentProvider]
})
export class ShopModule { }
