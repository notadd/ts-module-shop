import { Component, Inject, HttpException } from '@nestjs/common';
import { GoodsProperty } from '../model/GoodsProperty.entity';
import { GoodsType } from '../model/GoodsType.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Component()
export class GoodsTypeService {

    constructor(
        @InjectRepository(GoodsType) private readonly goodsTypeRepository: Repository<GoodsType>,
        @InjectRepository(GoodsProperty) private readonly goodsPropertyRepository: Repository<GoodsProperty>
    ) { }

    async createGoodsType(name: string): Promise<void> {
        let exist: GoodsType = await this.goodsTypeRepository.findOne({ name })
        if (exist) {
            throw new HttpException('指定name=' + name + '商品类型已存在', 404)
        }
        try {
            await this.goodsTypeRepository.save({ name })
        } catch (err) {
            throw new HttpException('发生了数据库错误' + err.toString(), 403)
        }
    }
}