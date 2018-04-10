import { Component, Inject, HttpException } from '@nestjs/common';
import { GoodsProperty } from '../model/GoodsProperty.entity';
import { Repository, QueryRunner, Connection } from 'typeorm';
import { GoodsType } from '../model/GoodsType.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Component()
export class GoodsPropertyService {

    constructor(
        @Inject(Connection) private readonly connection: Connection,
        @InjectRepository(GoodsType) private readonly goodsTypeRepository: Repository<GoodsType>,
        @InjectRepository(GoodsProperty) private readonly goodsPropertyRepository: Repository<GoodsProperty>
    ) { }

    async createGoodsProperty(goodsTypeId: number, name: string, type: string, inputType: string, list: string[]): Promise<void> {
        let goodsType: GoodsType = await this.goodsTypeRepository.findOneById(goodsTypeId)
        if (!goodsType) {
            throw new HttpException('指定id=' + goodsTypeId + '商品类型不存在', 404)
        }
        let exist: GoodsProperty = await this.goodsPropertyRepository.findOne({ name, goodsType })
        if (exist) {
            throw new HttpException('指定id' + goodsTypeId + '商品类型下已存在name=' + name + '商品属性', 404)
        }
        let goodsProperty: GoodsProperty = this.goodsPropertyRepository.create({ name, type, inputType, goodsType })
        if (inputType === 'list') {
            goodsProperty.list = list
        }
        try {
            await this.goodsPropertyRepository.save(goodsProperty)
        } catch (err) {
            throw new HttpException('发生了数据库错误' + err.toString(), 403)
        }
    }

    async updateGoodsProperty(id: number, name: string, type: string, inputType: string, list: string[]): Promise<void> {
        let goodsProperty: GoodsProperty = await this.goodsPropertyRepository.findOneById(id, { relations: ['goodsType', 'values'] })
        if (!goodsProperty) {
            throw new HttpException('指定id=' + id + '商品属性不存在', 404)
        }
        let ischange: boolean = false
        if (name && name !== goodsProperty.name) {
            let exist: GoodsProperty = await this.goodsPropertyRepository.findOne({ name, goodsType: goodsProperty.goodsType })
            if (exist) {
                throw new HttpException('指定name=' + name + '商品属性已存在于所属商品类型下', 404)
            }
            goodsProperty.name = name
            ischange = true
        }
        if (type && goodsProperty.type !== type) {
            goodsProperty.type = type
            ischange = true
        }
        if (inputType && goodsProperty.inputType !== inputType) {
            goodsProperty.inputType = inputType
            ischange = true
        }
        if (goodsProperty.inputType === 'list') {
            goodsProperty.list.forEach(item => {
                let find = list.find(i => {
                    return i === item
                })
                if (!find) {
                    ischange = true
                }
            })
            goodsProperty.list = list
        } else {
            goodsProperty.list = null
        }
        let queryRunner: QueryRunner = this.connection.createQueryRunner('master')
        try {
            await queryRunner.startTransaction()
            if (ischange) {
                await queryRunner.manager.remove(goodsProperty.values)
            }
            await queryRunner.manager.save(goodsProperty)
            await queryRunner.commitTransaction()
        } catch (err) {
            await queryRunner.rollbackTransaction()
            throw new HttpException('发生了数据库错误' + err.toString(), 403)
        }
    }

    async deleteGoodsProperty(id: number): Promise<void> {
        let goodsProperty: GoodsProperty = await this.goodsPropertyRepository.findOneById(id, { relations: ['goodsType'] })
        if (!goodsProperty) {
            throw new HttpException('指定id=' + id + '商品属性不存在', 404)
        }
        try {
            await this.goodsPropertyRepository.remove(goodsProperty)
        } catch (err) {
            throw new HttpException('发生了数据库错误' + err.toString(), 403)
        }
    }
}