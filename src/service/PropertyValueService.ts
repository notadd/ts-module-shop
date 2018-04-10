import { Component, Inject, HttpException } from '@nestjs/common';
import { PropertyValue } from '../model/PropertyValue.entity';
import { GoodsProperty } from '../model/GoodsProperty.entity';
import { Goods } from '../model/Goods.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Component()
export class PropertyValueService {

    constructor(
        @InjectRepository(Goods) private readonly goodsRepository: Repository<Goods>,
        @InjectRepository(PropertyValue) private readonly propertyValueRepository: Repository<PropertyValue>,
        @InjectRepository(GoodsProperty) private readonly goodsPropertyRepository: Repository<GoodsProperty>
    ) { }

    async createPropertyValue(goodsId: number, goodsPropertyId: number, value: string, price: number): Promise<void> {
        let goodsProperty: GoodsProperty = await this.goodsPropertyRepository.findOneById(goodsPropertyId, { relations: ['goodsType'] })
        if (!goodsProperty) {
            throw new HttpException('指定id=' + goodsPropertyId + '商品属性不存在', 404)
        }
        let goods: Goods = await this.goodsRepository.findOneById(goodsId, { relations: ['type'] })
        if (!goods) {
            throw new HttpException('指定id=' + goodsId + '商品不存在', 404)
        }
        if (goodsProperty.goodsType.id !== goods.type.id) {
            throw new HttpException('指定商品属性id=' + goodsPropertyId + '不属于指定商品类型id=' + goods.type.id, 404)
        }
        if (goodsProperty.type === 'unique' && price !== null && price !== undefined) {
            throw new HttpException('唯一属性不能指定价格', 404)
        }
        if (goodsProperty.type === 'radio' && (price === null || price === undefined)) {
            throw new HttpException('单选属性必须指定价格', 404)
        }
        if (goodsProperty.type === 'check' && (price === null || price === undefined)) {
            throw new HttpException('复选属性必须指定价格', 404)
        }
        if (goodsProperty.inputType === 'list') {
            let v = goodsProperty.list.find(item => {
                return item === value
            })
            if (!v) {
                throw new HttpException('指定商品属性值列表不包含value=' + value, 404
                )
            }
        }
        if (goodsProperty.type === 'unique') {
            let exist: PropertyValue = await this.propertyValueRepository.findOne({ property: goodsProperty, goods })
            if (exist) {
                throw new HttpException('指定商品下已存在指定唯一属性name=' + goodsProperty.name, 404)
            }
        }
        try {
            await this.propertyValueRepository.save({ value, price, property: goodsProperty, goods })
        } catch (err) {
            throw new HttpException('发生了数据库错误' + err.toString(), 403)
        }
    }


    async updatePropertyValue(id: number, value: string, price: number): Promise<void> {
        let propertyValue: PropertyValue = await this.propertyValueRepository.findOneById(id, { relations: ['property'] })
        if (!propertyValue) {
            throw new HttpException('指定id=' + id + '属性值不存在', 404)
        }
        value && (propertyValue.value = value)
        price !== null && price !== undefined && propertyValue.property.type !== 'unique' && (propertyValue.price = price)
        try {
            await this.propertyValueRepository.save(propertyValue)
        } catch (err) {
            throw new HttpException('发生了数据库错误' + err.toString(), 403)
        }
    }
}