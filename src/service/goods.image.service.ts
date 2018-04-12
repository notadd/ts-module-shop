import { Component, HttpException } from "@nestjs/common";
import { GoodsImage } from "../model/goods.image.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Goods } from "../model/goods.entity";
import { Repository } from "typeorm";


/* 商品图片的服务组件 */
@Component()
export class GoodsImageService {

    constructor(
        @InjectRepository(Goods) private readonly goodsRepository: Repository<Goods>,
        @InjectRepository(GoodsImage) private readonly goodsImageRepository: Repository<GoodsImage>
    ) { }

}