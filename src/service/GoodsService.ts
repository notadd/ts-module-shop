import { Component, HttpException, Inject } from '@nestjs/common';
import { ThirdClassify } from '../model/ThirdClassify.entity';
import { PropertyValue } from '../model/PropertyValue.entity';
import { Goods as IGoods } from '../interface/goods/Goods';
import { GoodsType } from '../model/GoodsType.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Goods } from '../model/Goods.entity';
import { Repository } from 'typeorm';
@Component()
export class GoodsService {

    constructor(
        @InjectRepository(Goods) private readonly goodsRepository: Repository<Goods>,
        @InjectRepository(GoodsType) private readonly goodsTypeRepository: Repository<GoodsType>,
        @InjectRepository(ThirdClassify) private readonly thirdClassifyRepository: Repository<ThirdClassify>,
        @InjectRepository(PropertyValue) private readonly propertyValueRepository: Repository<PropertyValue>
    ) { }

    async getGoodses(classifyId: number, pageNumber: number, pageSize: number): Promise<IGoods[]> {
        let classify: ThirdClassify = await this.thirdClassifyRepository.findOneById(classifyId)
        if (!classify) {
            throw new HttpException('指定id=' + classifyId + '分类不存在', 404)
        }
        let goodses: IGoods[] = await this.goodsRepository.createQueryBuilder('goods').select(['id', 'name', 'basePrice', 'description']).where({ classifyId }).getMany()
        return goodses
    }

    async getGoods(id: number): Promise<IGoods & any> {
        let goods: Goods = await this.goodsRepository.findOneById(id)
        if (!goods) {
            throw new HttpException('指定id=' + id + '商品不存在', 404)
        }
        let type: GoodsType = await this.goodsTypeRepository.findOneById(goods.type.id, { relations: ['properties'] })
        let values: PropertyValue[] = await this.propertyValueRepository.createQueryBuilder('value').select(['id', 'price', 'value', 'property']).where({ goods }).getMany()
        goods.type = type
        goods.values = values
        return goods
    }

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

    async updateGoods(id: number, name: string, basePrice: number, description: string, classifyId: number, goodsTypeId: number): Promise<void> {
        let goods: Goods = await this.goodsRepository.findOneById(id, { relations: ['classify', 'type'] })
        if (!goods) {
            throw new HttpException('指定id=' + id + '商品不存在', 404)
        }
        if (name && (name !== goods.name)) {
            let exist: Goods = await this.goodsRepository.findOne({ name })
            if (exist) {
                throw new HttpException('指定name=' + name + '商品已存在', 404)
            }
            goods.name = name
        }
        basePrice && (goods.basePrice = basePrice)
        description && (goods.description = description)
        if (classifyId && (classifyId !== goods.classify.id)) {
            let classify: ThirdClassify = await this.thirdClassifyRepository.findOneById(classifyId)
            if (!classify) {
                throw new HttpException('指定id=' + classifyId + '分类不存在', 404)
            }
            goods.classify = classify
        }
        if (goodsTypeId && (goodsTypeId !== goods.type.id)) {
            let type: GoodsType = await this.goodsTypeRepository.findOneById(goodsTypeId)
            if (!type) {
                throw new HttpException('指定id' + goodsTypeId + '商品类型不存在', 404)
            }
            goods.type = type
        }
        try {
            await this.goodsRepository.save(goods)
        } catch (err) {
            throw new HttpException('发生了数据库错误' + err.toString(), 403)
        }
    }

    /* 删除商品时，其下所有属性值也会被删除 */
    async deleteGoods(id: number): Promise<void> {
        let goods: Goods = await this.goodsRepository.findOneById(id)
        if (!goods) {
            throw new HttpException('指定id=' + id + '商品不存在', 404)
        }
        try {
            await this.goodsRepository.remove(goods)
        } catch (err) {
            throw new HttpException('发生了数据库错误' + err.toString(), 403)
        }
    }


}