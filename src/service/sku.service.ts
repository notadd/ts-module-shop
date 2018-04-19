import { Component, HttpException, Inject } from "@nestjs/common";
import { PropertyValue } from "../model/property.value.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Goods } from "../model/goods.entity";
import { Sku } from "../model/sku.entity";
import { Repository } from "typeorm";

/* 品牌的服务组件 */
@Component()
export class SkuService {

    constructor(
        @InjectRepository(Sku) private readonly skuRepository: Repository<Sku>,
        @InjectRepository(Goods) private readonly goodsRepository: Repository<Goods>,
        @InjectRepository(PropertyValue) private readonly propertyVValueRepository: Repository<PropertyValue>
    ) { }


}