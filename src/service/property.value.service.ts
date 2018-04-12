import { Component, Inject, HttpException } from "@nestjs/common";
import { PropertyValue } from "../model/property.value.entity";
import { GoodsProperty } from "../model/goods.property.entity";
import { Goods } from "../model/goods.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";


/* 属性值服务组件 */
@Component()
export class PropertyValueService {

    constructor(
        @InjectRepository(Goods) private readonly goodsRepository: Repository<Goods>,
        @InjectRepository(PropertyValue) private readonly propertyValueRepository: Repository<PropertyValue>,
        @InjectRepository(GoodsProperty) private readonly goodsPropertyRepository: Repository<GoodsProperty>
    ) { }

    /* 创建指定商品、指定属性的属性值 */
    async createPropertyValue(goodsId: number, goodsPropertyId: number, value: string, price: number): Promise<void> {
        const goodsProperty: GoodsProperty | undefined = await this.goodsPropertyRepository.findOneById(goodsPropertyId, { relations: ["goodsType"] });
        if (!goodsProperty) {
            throw new HttpException("指定id=" + goodsPropertyId + "商品属性不存在", 404);
        }
        const goods: Goods | undefined = await this.goodsRepository.findOneById(goodsId, { relations: ["type"] });
        if (!goods) {
            throw new HttpException("指定id=" + goodsId + "商品不存在", 404);
        }
        /* 商品属性必须从属于商品的商品类型 */
        if (goodsProperty.goodsType.id !== goods.type.id) {
            throw new HttpException("指定商品属性id=" + goodsPropertyId + "不属于指定商品类型id=" + goods.type.id, 404);
        }
        /* 唯一属性没有价格 */
        if (goodsProperty.type === "unique" && price !== null && price !== undefined) {
            throw new HttpException("唯一属性不能指定价格", 404);
        }
        /* 单选、复选属性必须有价格 */
        if (goodsProperty.type === "radio" && (price === null || price === undefined)) {
            throw new HttpException("单选属性必须指定价格", 404);
        }
        if (goodsProperty.type === "check" && (price === null || price === undefined)) {
            throw new HttpException("复选属性必须指定价格", 404);
        }
        /* 属性输入类型为list时，属性值必须被属性的list包含 */
        if (goodsProperty.inputType === "list") {
            const v = goodsProperty.list.find(item => {
                return item === value;
            });
            if (!v) {
                throw new HttpException("指定商品属性值列表不包含value=" + value, 404
                );
            }
        }
        /* 唯一属性值在同一个商品下只能有一个 */
        if (goodsProperty.type === "unique") {
            const exist: PropertyValue | undefined = await this.propertyValueRepository.findOne({ property: goodsProperty, goods });
            if (exist) {
                throw new HttpException("指定商品下已存在指定唯一属性name=" + goodsProperty.name, 404);
            }
        }
        try {
            await this.propertyValueRepository.save({ value, price, property: goodsProperty, goods });
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }


    /* 更新指定属性值，可以更新属性值属性价格*/
    async updatePropertyValue(id: number, value: string, price: number): Promise<void> {
        const propertyValue: PropertyValue | undefined = await this.propertyValueRepository.findOneById(id, { relations: ["property"] });
        if (!propertyValue) {
            throw new HttpException("指定id=" + id + "属性值不存在", 404);
        }
        value && (propertyValue.value = value);
        /* 当属性类型不是唯一属性才可以更新属性价格，唯一属性没有价格 */
        price !== null && price !== undefined && propertyValue.property.type !== "unique" && (propertyValue.price = price);
        try {
            await this.propertyValueRepository.save(propertyValue);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

    /* 删除指定id属性值 */
    async deletePropertyValue(id: number): Promise<void> {
        const propertyValue: PropertyValue | undefined = await this.propertyValueRepository.findOneById(id);
        if (!propertyValue) {
            throw new HttpException("指定id=" + id + "属性值不存在", 404);
        }
        try {
            await this.propertyValueRepository.remove(propertyValue);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }
}