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
        const exist: Floor|undefined = await this.floorRepository.findOne({name});
        if(exist) {
            throw new HttpException("指定name=" + name + "楼层已存在", 404);
        }
    }

}