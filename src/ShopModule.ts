import { ClassifyResolver } from './resolver/ClassifyResolver';
import { SecondClassify } from './model/SecondClassify.entity';
import { FirstClassify } from './model/FirstClassify.entity';
import { ThirdClassify } from './model/ThirdClassify.entity';
import { GoodsProperty } from './model/GoodsProperty.entity';
import { PropertyValue } from './model/PropertyValue.entity';
import { ClassifyService } from './service/ClassifyService';
import { GoodsResolver } from './resolver/GoodsResolver';
import { GoodsService } from './service/GoodsService';
import { GoodsType } from './model/GoodsType.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goods } from './model/Goods.entity';
import { Module } from '@nestjs/common';

@Module({
    modules: [TypeOrmModule.forFeature([FirstClassify, SecondClassify, ThirdClassify, Goods,GoodsType,GoodsProperty,PropertyValue])],
    components: [
        GoodsService, GoodsResolver,
        ClassifyService, ClassifyResolver
    ],
    controllers: [],
    exports: []
})
export class ShopModule { }