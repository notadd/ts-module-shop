import { ClassifyResolver } from './resolver/ClassifyResolver';
import { SecondClassify } from './model/SecondClassify.entity';
import { FirstClassify } from './model/FirstClassify.entity';
import { ThirdClassify } from './model/ThirdClassify.entity';
import { ClassifyService } from './service/ClassifyService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goods } from './model/Goods.entity';
import { Module } from '@nestjs/common';

@Module({
    modules: [TypeOrmModule.forFeature([FirstClassify, SecondClassify, ThirdClassify, Goods])],
    components: [
        ClassifyService, ClassifyResolver
    ],
    controllers: [],
    exports: []
})
export class ShopModule { }