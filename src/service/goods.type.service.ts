import { Component, Inject, HttpException } from "@nestjs/common";
import { GoodsType } from "../model/goods.type.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Component()
export class GoodsTypeService {

    constructor(
        @InjectRepository(GoodsType) private readonly goodsTypeRepository: Repository<GoodsType>,
    ) { }

    /* 获取指定id商品类型，以及其下所有商品属性 */
    async getGoodsType(id: number): Promise<GoodsType> {
        const goodsType: GoodsType | undefined = await this.goodsTypeRepository.findOneById(id, { relations: ["properties"] });
        if (!goodsType) {
            throw new HttpException("指定id=" + id + "商品类型不存在", 404);
        }
        return goodsType;
    }

    /* 获取当前所有商品类型 */
    async getGoodsTypes(): Promise<Array<GoodsType>> {
        return this.goodsTypeRepository.find();
    }

    /* 创建指定名称商品类型 ，名称已存在，抛出异常*/
    async createGoodsType(name: string): Promise<void> {
        const exist: GoodsType | undefined = await this.goodsTypeRepository.findOne({ name });
        if (exist) {
            throw new HttpException("指定name=" + name + "商品类型已存在", 404);
        }
        try {
            await this.goodsTypeRepository.save({ name });
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

    /* 更新指定名称商品类型，只更新名称，其下所有商品属性、商品不变 */
    async updateGoodsType(id: number, name: string): Promise<void> {
        const goodsType: GoodsType | undefined = await this.goodsTypeRepository.findOneById(id);
        if (!goodsType) {
            throw new HttpException("指定id=" + id + "商品类型不存在", 404);
        }
        if (name && (name !== goodsType.name)) {
            const exist: GoodsType | undefined = await this.goodsTypeRepository.findOne({ name });
            if (exist) {
                throw new HttpException("指定name=" + name + "商品类型已存在", 404);
            }
            goodsType.name = name;
        }
        try {
            await this.goodsTypeRepository.save(goodsType);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

    /* 删除指定id商品类型，商品类型下存在商品则抛出异常，商品属性级联删除 */
    async deleteGoodsType(id: number): Promise<void> {
        const goodsType: GoodsType | undefined = await this.goodsTypeRepository.findOneById(id, { relations: ["properties", "goodses"] });
        if (!goodsType) {
            throw new HttpException("指定id=" + id + "商品类型不存在", 404);
        }
        /* 商品类型下还有商品则不能删除，必须先解除两者关系 */
        if (goodsType.goodses && goodsType.goodses.length > 0) {
            throw new HttpException("指定商品类型下存在商品，请先将商品移动到其他商品类型下再删除", 404);
        }
        try {
            await this.goodsTypeRepository.remove(goodsType);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }
}
