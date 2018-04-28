import { UserReceivingInformationResolver } from "./resolver/user.receiving.information.resolver";
import { UserReceivingInformationService } from "./service/user.receiving.information.service";
import { UserReceivingInformation } from "./model/user.receiving.information.entity";
import { GoodsPropertyResolver } from "./resolver/goods.property.resolver";
import { PropertyValueResolver } from "./resolver/property.value.resolver";
import { ShopComponentProvider } from "./export/shop.component.provider";
import { PropertyValueService } from "./service/property.value.service";
import { GoodsPropertyService } from "./service/goods.property.service";
import { GoodsImageResolver } from "./resolver/goods.image.resolver";
import { GoodsTypeResolver } from "./resolver/goods.type.resolver";
import { OrderItemResolver } from "./resolver/order.item.resolver";
import { GoodsImageService } from "./service/goods.image.service";
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
import { GoodsResolver } from "./resolver/goods.resolver";
import { BrandResolver } from "./resolver/brand.resolver";
import { OrderResolver } from "./resolver/order.resolver";
import { GoodsImage } from "./model/goods.image.entity";
import { GoodsService } from "./service/goods.service";
import { BrandService } from "./service/brand.service";
import { OrderService } from "./service/order.service";
import { GoodsType } from "./model/goods.type.entity";
import { BrandLogo } from "./model/brand.logo.entity";
import { SkuResolver } from "./resolver/sku.resolver";
import { OrderItem } from "./model/order.item.entity";
import { Delivery } from "./model/delivery.entity";
import { SkuService } from "./service/sku.service";
import { Setting } from "./model/setting.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RandomUtil } from "./util/random.util";
import { Brand } from "./model/brand.entity";
import { Goods } from "./model/goods.entity";
import { Order } from "./model/order.entity";
import { DateUtil } from "./util/date.util";
import { Sku } from "./model/sku.entity";
import { Module } from "@nestjs/common";

@Module({
    modules: [TypeOrmModule.forFeature([FirstClassify, SecondClassify, ThirdClassify,
        Goods, GoodsType, GoodsImage, GoodsProperty, PropertyValue,
        Brand, BrandLogo, Sku, Order, OrderItem, Delivery, UserReceivingInformation])],
    components: [
        Setting,
        DateUtil, RandomUtil,
        SkuService, SkuResolver,
        OrderService, OrderResolver,
        GoodsService, GoodsResolver,
        BrandService, BrandResolver,
        DeliveryService, DeliveryResolver,
        ClassifyService, ClassifyResolver,
        GoodsTypeService, GoodsTypeResolver,
        OrderItemService, OrderItemResolver,
        GoodsImageService, GoodsImageResolver,
        GoodsPropertyService, GoodsPropertyResolver,
        PropertyValueService, PropertyValueResolver,
        UserReceivingInformationService, UserReceivingInformationResolver,
        ShopComponentProvider
    ],
    controllers: [],
    exports: [ShopComponentProvider]
})
export class ShopModule { }