import { Component, HttpException, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Sku } from "../model/sku.entity";
import { Repository } from "typeorm";

/* 品牌的服务组件 */
@Component()
export class SkuService {

    constructor(
        @InjectRepository(Sku) private readonly skuRepository: Repository<Sku>
    ) { }
}