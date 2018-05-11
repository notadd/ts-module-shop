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

    async getFloors(): Promise<Array<Floor>> {
        const floors: Array<Floor> | undefined = await this.floorRepository.find();
        return floors;
    }

    async getFloor(id: number): Promise<Floor> {
        const floor: Floor | undefined = await this.floorRepository.createQueryBuilder("floor")
            .leftJoinAndSelect("floor.goodses", "goods")
            .where({ id })
            .getOne();
        if (!floor) {
            throw new HttpException("指定id=" + id + "楼层不存在", 404);
        }
        return floor;
    }

    async createFloor(name: string, display: boolean, goodsIds: Array<number>): Promise<void> {
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
            await this.floorRepository.save({ name, display: display, goodses });
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

    async updateFloor(id: number, name: string, display: boolean, goodsIds: Array<number>): Promise<void> {
        const floor: Floor | undefined = await this.floorRepository.findOneById(id);
        if (!floor) {
            throw new HttpException("指定id=" + id + "楼层不存在", 404);
        }
        if (floor.name !== name) {
            const exist: Floor | undefined = await this.floorRepository.findOne({ name });
            if (exist) {
                throw new HttpException("指定name=" + name + "楼层已存在", 404);
            }
            floor.name = name;
        }
        floor.display = display;
        const goodses: Array<Goods> | undefined = await this.goodsRepository.findByIds(goodsIds);
        for (let i = 0; i < goodsIds.length; i++) {
            const find: Goods | undefined = goodses.find(goods => goods.id === goodsIds[i]);
            if (!find) {
                throw new HttpException("指定id=" + goodsIds[i] + "商品未找到", 404);
            }
        }
        floor.goodses = goodses;
        try {
            await this.floorRepository.save(floor);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

    async deleteFloor(id: number): Promise<void> {
        const floor: Floor | undefined = await this.floorRepository.findOneById(id);
        if (!floor) {
            throw new HttpException("指定id=" + id + "楼层不存在", 404);
        }
        try {
            await this.floorRepository.remove(floor);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

}
