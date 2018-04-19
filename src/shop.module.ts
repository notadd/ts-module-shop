import { GoodsPropertyResolver } from "./resolver/goods.property.resolver";
import { PropertyValueResolver } from "./resolver/property.value.resolver";
import { ShopComponentProvider } from "./export/shop.component.provider";
import { PropertyValueService } from "./service/property.value.service";
import { GoodsPropertyService } from "./service/goods.property.service";
import { GoodsImageResolver } from "./resolver/goods.image.resolver";
import { GoodsTypeResolver } from "./resolver/goods.type.resolver";
import { GoodsImageService } from "./service/goods.image.service";
import { ClassifyResolver } from "./resolver/classify.resolver";
import { SecondClassify } from "./model/second.classify.entity";
import { GoodsTypeService } from "./service/goods.type.service";
import { FirstClassify } from "./model/first.classify.entity";
import { ThirdClassify } from "./model/third.classify.entity";
import { GoodsProperty } from "./model/goods.property.entity";
import { PropertyValue } from "./model/property.value.entity";
import { ClassifyService } from "./service/classify.service";
import { GoodsResolver } from "./resolver/goods.resolver";
import { BrandResolver } from "./resolver/brand.resolver";
import { GoodsImage } from "./model/goods.image.entity";
import { GoodsService } from "./service/goods.service";
import { BrandService } from "./service/brand.service";
import { GoodsType } from "./model/goods.type.entity";
import { BrandLogo } from "./model/brand.logo.entity";
import { SkuResolver } from "./resolver/sku.resolver";
import { SkuService } from "./service/sku.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Brand } from "./model/brand.entity";
import { Goods } from "./model/goods.entity";
import { Sku } from "./model/sku.entity";
import { Module } from "@nestjs/common";

@Module({
    modules: [TypeOrmModule.forFeature([FirstClassify, SecondClassify, ThirdClassify,
        Goods, GoodsType, GoodsImage, GoodsProperty, PropertyValue,
        Brand, BrandLogo, Sku])],
    components: [
        SkuService, SkuResolver,
        GoodsService, GoodsResolver,
        BrandService, BrandResolver,
        ClassifyService, ClassifyResolver,
        GoodsTypeService, GoodsTypeResolver,
        GoodsImageService, GoodsImageResolver,
        GoodsPropertyService, GoodsPropertyResolver,
        PropertyValueService, PropertyValueResolver,
        ShopComponentProvider
    ],
    controllers: [],
    exports: [ShopComponentProvider]
})
export class ShopModule { }