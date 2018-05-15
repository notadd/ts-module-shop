import { Injectable, HttpException, Inject } from "@nestjs/common";
import { PropertyValue } from "../model/property.value.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Goods } from "../model/goods.entity";
import { Sku } from "../model/sku.entity";
import { Repository } from "typeorm";

/* 品牌的服务组件 */
@Injectable()
export class SkuService {

    constructor(
        @InjectRepository(Sku) private readonly skuRepository: Repository<Sku>,
        @InjectRepository(Goods) private readonly goodsRepository: Repository<Goods>,
        @InjectRepository(PropertyValue) private readonly propertyValueRepository: Repository<PropertyValue>
    ) { }

    async getSkus(goodsId: number): Promise<Array<Sku>> {
        const goods: Goods | undefined = await this.goodsRepository.createQueryBuilder("goods")
            .where({ id: goodsId })
            .leftJoinAndSelect("goods.skus", "sku")
            .leftJoinAndSelect("sku.values", "value")
            .leftJoinAndSelect("value.property", "property")
            .getOne();
        if (!goods) {
            throw new HttpException("指定id=" + goodsId + "商品不存在", 404);
        }
        return goods.skus;
    }

    async createSku(goodsId: number, no: string, inventory: number, propertyValueIds: Array<number>): Promise<void> {
        const goods: Goods | undefined = await this.goodsRepository.findOne(goodsId);
        if (!goods) {
            throw new HttpException("指定id=" + goodsId + "商品不存在", 404);
        }
        const values: Array<PropertyValue> | undefined = await this.propertyValueRepository.findByIds(propertyValueIds, { relations: ["property", "goods"] });
        for (let i = 0; i < propertyValueIds.length; i++) {
            const find: PropertyValue | undefined = values.find(value => value.id === propertyValueIds[i]);
            if (!find) {
                throw new HttpException("指定id=" + propertyValueIds[i] + "属性值不存在", 404);
            }
            if (find.goods.id !== goods.id) {
                throw new HttpException("指定id=" + propertyValueIds[i] + "属性值不存在于指定id=" + goods.id + "商品之下", 404);
            }
            if (find.property.type !== "radio") {
                throw new HttpException("指定id=" + propertyValueIds[i] + "属性值的属性不是单选类型，只有单选类型属性值可以作为sku添加", 404);
            }
        }
        try {
            await this.skuRepository.save({ no, inventory, goods, values });
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

    async updateSku(id: number, no: string, inventory: number, propertyValueIds: Array<number>): Promise<void> {
        const sku: Sku | undefined = await this.skuRepository.findOne(id, { relations: ["goods", "values"] });
        if (!sku) {
            throw new HttpException("指定id=" + id + "Sku不存在", 404);
        }
        if (no) {
            sku.no = no;
        }
        if (inventory) {
            sku.inventory = inventory;
        }
        if (propertyValueIds && propertyValueIds.length !== 0) {
            const values: Array<PropertyValue> | undefined = await this.propertyValueRepository.findByIds(propertyValueIds, { relations: ["property", "goods"] });
            for (let i = 0; i < propertyValueIds.length; i++) {
                const find: PropertyValue | undefined = values.find(value => value.id === propertyValueIds[i]);
                if (!find) {
                    throw new HttpException("指定id=" + propertyValueIds[i] + "属性值不存在", 404);
                }
                if (find.goods.id !== sku.goods.id) {
                    throw new HttpException("指定id=" + propertyValueIds[i] + "属性值不存在于指定id=" + sku.goods.id + "商品之下", 404);
                }
                if (find.property.type !== "radio") {
                    throw new HttpException("指定id=" + propertyValueIds[i] + "属性值的属性不是单选类型，只有单选类型属性值可以作为sku添加", 404);
                }
            }
            sku.values = values;
        }
        try {
            await this.skuRepository.save(sku);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

    async deleteSku(id: number): Promise<void> {
        const sku: Sku | undefined = await this.skuRepository.findOne(id, { relations: ["values"] });
        if (!sku) {
            throw new HttpException("指定id=" + id + "Sku不存在", 404);
        }
        try {
            sku.values = undefined as any;
            await this.skuRepository.save(sku);
            await this.skuRepository.remove(sku);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }
}
