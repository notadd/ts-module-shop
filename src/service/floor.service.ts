import { Component, HttpException, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Floor } from "../model/floor.entity";
import { Goods } from "../model/goods.entity";
import { Repository } from "typeorm";
import { Request } from "express";

/* 楼层的服务组件 */
@Component()
export class FloorService {

    constructor(
        @InjectRepository(Goods) private readonly goodsRepository: Repository<Goods>,
        @InjectRepository(Floor) private readonly floorRepository: Repository<Floor>
    ) { }

    async createFloor(name: string, display: string, goodsIds: Array<number>): Promise<void> {
        const exist: Floor | undefined = await this.floorRepository.findOne({ name });
        if (exist) {
            throw new HttpException("指定name=" + name + "楼层已存在", 404);
        }
        const goodses: Array<Goods> | undefined = await this.goodsRepository.findByIds(goodsIds);
        for (let i = 0; i < goodsIds.length; i++) {
            const find: Goods | undefined = goodses.find(goods => goods.id === goodsIds[i]);
            if (!find) {
                throw new HttpException("指定id=" + goodsIds[i] + "商品未找到", 404);
            }
        }
        try {
            await this.floorRepository.save({ name, display: !!display, goodses });
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

}