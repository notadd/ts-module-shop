import { Component, HttpException, Inject } from '@nestjs/common';
import { ThirdClassify } from '../model/ThirdClassify.entity';
import { GoodsType } from '../model/GoodsType.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Goods } from '../model/Goods.entity';
import { Repository } from 'typeorm';

@Component()
export class GoodsService {

    constructor(
        @InjectRepository(Goods) private readonly goodsRepository: Repository<Goods>,
        @InjectRepository(GoodsType) private readonly goodsTypeRepository: Repository<GoodsType>,
        @InjectRepository(ThirdClassify) private readonly thirdClassifyRepository: Repository<ThirdClassify>
    ) { }

    async createGoods(name: string, basePrice: number, description: string, classifyId: number, goodsTypeId: number): Promise<void> {
        let exist: Goods = await this.goodsRepository.findOne({ name })
        if (exist) {
            throw new HttpException('指定name=' + name + '商品已存在', 404)
        }
        let classify: ThirdClassify = await this.thirdClassifyRepository.findOneById(classifyId)
        if (!classify) {
            throw new HttpException('指定id=' + classifyId + '分类不存在', 404)
        }
        let type: GoodsType = await this.goodsTypeRepository.findOneById(goodsTypeId)
        if (!type) {
            throw new HttpException('指定id' + goodsTypeId + '商品类型不存在', 404)
        }
        try {
            await this.goodsRepository.save({ name, basePrice, description, classify, type })
        } catch (err) {
            throw new HttpException('发生了数据库错误' + err.toString(), 403)
        }
    }


}