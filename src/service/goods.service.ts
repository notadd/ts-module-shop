import { Repository, Connection, QueryRunner, SelectQueryBuilder } from "typeorm";
import { Component, HttpException, Inject } from "@nestjs/common";
import { ThirdClassify } from "../model/third.classify.entity";
import { PropertyValue } from "../model/property.value.entity";
import { GoodsData } from "../interface/goods/goods.data";
import { GoodsType } from "../model/goods.type.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Goods } from "../model/goods.entity";
import { Brand } from "../model/brand.entity";


/* 商品服务组件 */
@Component()
export class GoodsService {

    constructor(
        @Inject(Connection) private readonly connection: Connection,
        @InjectRepository(Brand) private readonly brandRepository: Repository<Brand>,
        @InjectRepository(Goods) private readonly goodsRepository: Repository<Goods>,
        @InjectRepository(GoodsType) private readonly goodsTypeRepository: Repository<GoodsType>,
        @InjectRepository(ThirdClassify) private readonly thirdClassifyRepository: Repository<ThirdClassify>,
        @InjectRepository(PropertyValue) private readonly propertyValueRepository: Repository<PropertyValue>
    ) { }

    /* 获取指定分类下所有商品，如果传递分页参数则分页获取,只能获取不在回收站中商品 */
    async getGoodses(classifyId: number, pageNumber: number, pageSize: number): Promise<Array<Goods>> {
        const classify: ThirdClassify | undefined = await this.thirdClassifyRepository.findOneById(classifyId);
        if (!classify) {
            throw new HttpException("指定id=" + classifyId + "分类不存在", 404);
        }
        let queryBuilder: SelectQueryBuilder<Goods> = this.goodsRepository
            .createQueryBuilder("goods")
            .select(["goods.id", "goods.name", "goods.basePrice", "goods.description", "goods.recycle"])
            .where({ classifyId, recycle: false });
        if (pageNumber && pageSize) {
            queryBuilder = queryBuilder.offset((pageNumber - 1) * pageSize).limit(pageSize);
        }
        const goodses: Array<Goods> = await queryBuilder.getMany();
        return goodses;
    }

    /* 获取回收站中商品，可以分页获取 */
    async getRecycleGoodses(pageNumber: number, pageSize: number): Promise<Array<Goods>> {
        let queryBuilder: SelectQueryBuilder<Goods> = this.goodsRepository
            .createQueryBuilder("goods")
            .select(["goods.id", "goods.name", "goods.basePrice", "goods.description", "goods.recycle"])
            .where({ recycle: true });
        if (pageNumber && pageSize) {
            queryBuilder = queryBuilder.offset((pageNumber - 1) * pageSize).limit(pageSize);
        }
        const recycleGoodses: Array<Goods> = await queryBuilder.getMany();
        return recycleGoodses;
    }

    /* 获取指定的详细信息，会同时获取商品所属类型以及类型下的属性、商品下所有属性值以及属性值关联的属性 */
    async getGoods(id: number): Promise<Goods> {
        const goods: Goods | undefined = await this.goodsRepository.findOneById(id, { relations: ["type", "values"] });
        if (!goods) {
            throw new HttpException("指定id=" + id + "商品不存在", 404);
        }
        // const values: Array<PropertyValue> = await this.propertyValueRepository.createQueryBuilder("value").select(["value.id", "value.price", "value.value"]).where({ goods }).leftJoinAndSelect("value.property", "property").getMany();
        return goods;
    }

    /* 创建商品，只有品牌可以为空，其他属性都不能为空 */
    async createGoods(name: string, basePrice: number, description: string, classifyId: number, goodsTypeId: number, brandId: number): Promise<void> {
        const exist: Goods | undefined = await this.goodsRepository.findOne({ name });
        if (exist) {
            throw new HttpException("指定name=" + name + "商品已存在", 404);
        }
        const classify: ThirdClassify | undefined = await this.thirdClassifyRepository.findOneById(classifyId);
        if (!classify) {
            throw new HttpException("指定id=" + classifyId + "分类不存在", 404);
        }
        const type: GoodsType | undefined = await this.goodsTypeRepository.findOneById(goodsTypeId);
        if (!type) {
            throw new HttpException("指定id" + goodsTypeId + "商品类型不存在", 404);
        }
        let brand: Brand | undefined;
        if (brandId) {
            brand = await this.brandRepository.findOneById(brandId);
            if (!brand) {
                throw new HttpException("指定id" + brandId + "品牌不存在", 404);
            }
        }
        try {
            await this.goodsRepository.save({ name, basePrice, description, classify, type, brand });
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

    /* 更新指定商品，如果商品分类被更新，则商品下原来所有的商品属性值都会被删除 */
    async updateGoods(id: number, name: string, basePrice: number, description: string, classifyId: number, goodsTypeId: number, brandId: number): Promise<void> {
        const goods: Goods | undefined = await this.goodsRepository.findOneById(id, { relations: ["classify", "type", "values", "brand"] });
        if (!goods) {
            throw new HttpException("指定id=" + id + "商品不存在", 404);
        }
        if (goods.recycle) {
            throw new HttpException("指定id=" + id + "商品已经存在于回收站中，不能更新", 404);
        }
        if (name && (name !== goods.name)) {
            const exist: Goods | undefined = await this.goodsRepository.findOne({ name });
            if (exist) {
                throw new HttpException("指定name=" + name + "商品已存在", 404);
            }
            goods.name = name;
        }
        basePrice && (goods.basePrice = basePrice);
        description && (goods.description = description);
        if (classifyId && (classifyId !== goods.classify.id)) {
            const classify: ThirdClassify | undefined = await this.thirdClassifyRepository.findOneById(classifyId);
            if (!classify) {
                throw new HttpException("指定id=" + classifyId + "分类不存在", 404);
            }
            goods.classify = classify;
        }
        /* 解除商品与商品类型关系时，需要删除商品下存在的属性值 */
        let changeGoodsType = false;
        if (goodsTypeId && (goodsTypeId !== goods.type.id)) {
            const type: GoodsType | undefined = await this.goodsTypeRepository.findOneById(goodsTypeId);
            if (!type) {
                throw new HttpException("指定id" + goodsTypeId + "商品类型不存在", 404);
            }
            goods.type = type;
            changeGoodsType = true;
        }
        if (brandId && (brandId !== goods.brand.id)) {
            const brand: Brand | undefined = await this.brandRepository.findOneById(brandId);
            if (!brand) {
                throw new HttpException("指定id" + brandId + "品牌不存在", 404);
            }
            goods.brand = brand;
        }
        const queryRunner: QueryRunner = this.connection.createQueryRunner("master");
        try {
            await queryRunner.startTransaction();
            if (changeGoodsType) {
                await queryRunner.manager.remove(goods.values);
            }
            await queryRunner.manager.save(goods);
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

    /* 删除商品时，其下所有属性值也会被删除,这是由数据库的外键关联删除的 */
    async deleteGoods(id: number): Promise<void> {
        const goods: Goods | undefined = await this.goodsRepository.findOneById(id);
        if (!goods) {
            throw new HttpException("指定id=" + id + "商品不存在", 404);
        }
        if (!goods.recycle) {
            throw new HttpException("指定id=" + id + "商品不在回收站中，不能删除，需要先放入回收站中才可删除", 404);
        }
        try {
            await this.goodsRepository.remove(goods);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

    /* 软删除商品，即放入回收站中，其实是将商品的recycle属性置为true，说明商品在回收站中 */
    async softDeleteGoods(id: number): Promise<void> {
        const goods: Goods | undefined = await this.goodsRepository.findOneById(id);
        if (!goods) {
            throw new HttpException("指定id=" + id + "商品不存在", 404);
        }
        if (goods.recycle) {
            throw new HttpException("指定id=" + id + "商品已经存在于回收站中，不需要软删除", 404);
        }
        try {
            goods.recycle = true;
            await this.goodsRepository.save(goods);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

    /* 软删除多个商品 */
    async softDeleteGoodses(ids: Array<number>): Promise<void> {
        const goodses: Array<Goods> | undefined = await this.goodsRepository.findByIds(ids);
        for (let i = 0; i < ids.length; i++) {
            const index: number = goodses.findIndex(goods => {
                return goods.id === ids[i];
            });
            if (index < 0) {
                throw new HttpException("指定id=" + ids[i] + "商品不存在", 404);
            }
            if (goodses[index].recycle) {
                throw new HttpException("指定id=" + ids[i] + "商品已经存在于回收站中，不需要软删除", 404);
            }
            goodses[index].recycle = true;
        }
        try {
            await this.goodsRepository.save(goodses);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

    /* 从回收站中还原商品，即将recycle属性置为false */
    async restoreGoods(id: number): Promise<void> {
        const goods: Goods | undefined = await this.goodsRepository.findOneById(id);
        if (!goods) {
            throw new HttpException("指定id=" + id + "商品不存在", 404);
        }
        if (!goods.recycle) {
            throw new HttpException("指定id=" + id + "商品不在回收站中，不需要还原", 404);
        }
        try {
            goods.recycle = false;
            await this.goodsRepository.save(goods);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

    /* 还原多个商品 */
    async restoreGoodses(ids: Array<number>): Promise<void> {
        const goodses: Array<Goods> | undefined = await this.goodsRepository.findByIds(ids);
        for (let i = 0; i < ids.length; i++) {
            const index: number = goodses.findIndex(goods => {
                return goods.id === ids[i];
            });
            if (index < 0) {
                throw new HttpException("指定id=" + ids[i] + "商品不存在", 404);
            }
            if (!goodses[index].recycle) {
                throw new HttpException("指定id=" + ids[i] + "商品不在回收站中，不需要还原", 404);
            }
            goodses[index].recycle = false;
        }
        try {
            await this.goodsRepository.save(goodses);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }


}