import { Component, HttpException, Inject } from '@nestjs/common';
import { ThirdClassify } from '../model/ThirdClassify.entity';
import { PropertyValue } from '../model/PropertyValue.entity';
import { Repository, Connection, QueryRunner } from 'typeorm';
import { GoodsData } from '../interface/goods/GoodsData';
import { GoodsType } from '../model/GoodsType.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Goods } from '../model/Goods.entity';
@Component()
export class GoodsService {

    constructor(
        @Inject(Connection) private readonly connection: Connection,
        @InjectRepository(Goods) private readonly goodsRepository: Repository<Goods>,
        @InjectRepository(GoodsType) private readonly goodsTypeRepository: Repository<GoodsType>,
        @InjectRepository(ThirdClassify) private readonly thirdClassifyRepository: Repository<ThirdClassify>,
        @InjectRepository(PropertyValue) private readonly propertyValueRepository: Repository<PropertyValue>
    ) { }

    async getGoodses(classifyId: number, pageNumber: number, pageSize: number): Promise<Goods[]> {
        let classify: ThirdClassify = await this.thirdClassifyRepository.findOneById(classifyId)
        if (!classify) {
            throw new HttpException('指定id=' + classifyId + '分类不存在', 404)
        }
        let goodses: Goods[] = await this.goodsRepository.createQueryBuilder('goods').select(['id', 'name', 'basePrice', 'description']).where({ classifyId }).getMany()
        return goodses
    }

    async getGoods(id: number): Promise<Goods> {
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
        let goods: Goods = await this.goodsRepository.findOneById(id, { relations: ['classify', 'type', 'values'] })
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
        /* 解除商品与商品类型关系时，需要删除商品下存在的属性值 */
        let changeGoodsType: boolean
        if (goodsTypeId && (goodsTypeId !== goods.type.id)) {
            let type: GoodsType = await this.goodsTypeRepository.findOneById(goodsTypeId)
            if (!type) {
                throw new HttpException('指定id' + goodsTypeId + '商品类型不存在', 404)
            }
            goods.type = type
            changeGoodsType = true
        }
        let queryRunner: QueryRunner = this.connection.createQueryRunner('master')
        try {
            await queryRunner.startTransaction()
            if (changeGoodsType) {
                await queryRunner.manager.remove(goods.values)
            }
            await queryRunner.manager.save(goods)
            await queryRunner.commitTransaction()
        } catch (err) {
            await queryRunner.rollbackTransaction()
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