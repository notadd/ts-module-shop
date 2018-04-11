import { Component, HttpException, Inject } from "@nestjs/common";
import { ThirdClassify } from "../model/third.classify.entity";
import { PropertyValue } from "../model/property.value.entity";
import { Repository, Connection, QueryRunner } from "typeorm";
import { GoodsData } from "../interface/goods/goods.data";
import { GoodsType } from "../model/goods.type.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Goods } from "../model/goods.entity";
import { Brand } from "../model/brand.entity";
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

    async getGoodses(classifyId: number, pageNumber: number, pageSize: number): Promise<Array<Goods>> {
        const classify: ThirdClassify|undefined = await this.thirdClassifyRepository.findOneById(classifyId);
        if (!classify) {
            throw new HttpException("指定id=" + classifyId + "分类不存在", 404);
        }
        const goodses: Array<Goods> = await this.goodsRepository.createQueryBuilder("goods").select(["goods.id", "goods.name", "goods.basePrice", "goods.description"]).where({ classifyId }).getMany();
        return goodses;
    }

    async getGoods(id: number): Promise<Goods> {
        const goods: Goods|undefined = await this.goodsRepository.findOneById(id);
        if (!goods) {
            throw new HttpException("指定id=" + id + "商品不存在", 404);
        }
        const type: GoodsType|undefined = await this.goodsTypeRepository.findOneById(goods.type.id, { relations: ["properties"] });
        const values: Array<PropertyValue> = await this.propertyValueRepository.createQueryBuilder("value").select(["value.id", "value.price", "value.value"]).where({ goods }).leftJoinAndSelect("value.property", "property").getMany();
        goods.type = type as any;
        goods.values = values;
        return goods;
    }

    async createGoods(name: string, basePrice: number, description: string, classifyId: number, goodsTypeId: number, brandId: number): Promise<void> {
        const exist: Goods|undefined = await this.goodsRepository.findOne({ name });
        if (exist) {
            throw new HttpException("指定name=" + name + "商品已存在", 404);
        }
        const classify: ThirdClassify|undefined = await this.thirdClassifyRepository.findOneById(classifyId);
        if (!classify) {
            throw new HttpException("指定id=" + classifyId + "分类不存在", 404);
        }
        const type: GoodsType|undefined = await this.goodsTypeRepository.findOneById(goodsTypeId);
        if (!type) {
            throw new HttpException("指定id" + goodsTypeId + "商品类型不存在", 404);
        }
        let brand: Brand|undefined;
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

    async updateGoods(id: number, name: string, basePrice: number, description: string, classifyId: number, goodsTypeId: number, brandId: number): Promise<void> {
        const goods: Goods|undefined = await this.goodsRepository.findOneById(id, { relations: ["classify", "type", "values", "brand"] });
        if (!goods) {
            throw new HttpException("指定id=" + id + "商品不存在", 404);
        }
        if (name && (name !== goods.name)) {
            const exist: Goods|undefined = await this.goodsRepository.findOne({ name });
            if (exist) {
                throw new HttpException("指定name=" + name + "商品已存在", 404);
            }
            goods.name = name;
        }
        basePrice && (goods.basePrice = basePrice);
        description && (goods.description = description);
        if (classifyId && (classifyId !== goods.classify.id)) {
            const classify: ThirdClassify|undefined = await this.thirdClassifyRepository.findOneById(classifyId);
            if (!classify) {
                throw new HttpException("指定id=" + classifyId + "分类不存在", 404);
            }
            goods.classify = classify;
        }
        /* 解除商品与商品类型关系时，需要删除商品下存在的属性值 */
        let changeGoodsType = false;
        if (goodsTypeId && (goodsTypeId !== goods.type.id)) {
            const type: GoodsType|undefined = await this.goodsTypeRepository.findOneById(goodsTypeId);
            if (!type) {
                throw new HttpException("指定id" + goodsTypeId + "商品类型不存在", 404);
            }
            goods.type = type;
            changeGoodsType = true;
        }
        if (brandId && (brandId !== goods.brand.id)) {
            const brand: Brand|undefined = await this.brandRepository.findOneById(brandId);
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

    /* 删除商品时，其下所有属性值也会被删除 */
    async deleteGoods(id: number): Promise<void> {
        const goods: Goods|undefined = await this.goodsRepository.findOneById(id);
        if (!goods) {
            throw new HttpException("指定id=" + id + "商品不存在", 404);
        }
        try {
            await this.goodsRepository.remove(goods);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }


}