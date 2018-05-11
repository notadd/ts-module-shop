import { Repository, Connection, SelectQueryBuilder } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm/typeorm.utils";
import { SecondClassify } from "../model/second.classify.entity";
import { ThirdClassify } from "../model/third.classify.entity";
import { FirstClassify } from "../model/first.classify.entity";
import { HttpException } from "@nestjs/common";
import { Goods } from "../model/goods.entity";

export class ShopComponent {

    constructor(
        private readonly goodsRepository: Repository<Goods>,
        private readonly firstClassifyRepository: Repository<FirstClassify>,
        private readonly secondClassifyRepository: Repository<SecondClassify>,
        private readonly thirdClassifyRepository: Repository<ThirdClassify>
    ) { }

    async getSubClassifyIds(id: number, level: 1 | 2): Promise<Array<number> | undefined> {
        if (level === 1) {
            const firstClassify: FirstClassify | undefined = await this.firstClassifyRepository.createQueryBuilder("first")
                .leftJoinAndSelect("first.children", "second")
                .select(["second.id"])
                .getOne();
            if (!firstClassify) {
                throw new HttpException("指定id=" + id + "一级分类不存在", 404);
            }
            return firstClassify.children.map(second => second.id);
        } else if (level === 2) {
            const secondClassify: SecondClassify | undefined = await this.secondClassifyRepository.createQueryBuilder("second")
                .leftJoinAndSelect("second.children", "third")
                .select(["third.id"])
                .getOne();
            if (!secondClassify) {
                throw new HttpException("指定id=" + id + "二级分类不存在", 404);
            }
            return secondClassify.children.map(third => third.id);
        } else {
            return undefined;
        }
    }

    async getGoodsById(id: number): Promise<Goods> {
        const goods: Goods | undefined = await this.goodsRepository.createQueryBuilder("goods")
            .select(["goods.id", "goods.name", "goods.no", "goods.basePrice", "goods.discountPrice"])
            .where({ id, recycle: false })
            .leftJoinAndSelect("goods.classify", "classify")
            .leftJoinAndSelect("goods.images", "image")
            .getOne();
        if (!goods) {
            throw new HttpException("指定id=" + id + "商品不存在", 404);
        }
        return goods;
    }

    async getGoodsesByIds(ids: Array<number>, pageNumber: number, pageSize: number): Promise<Array<Goods>> {
        let queryBuilder: SelectQueryBuilder<Goods> = this.goodsRepository.createQueryBuilder("goods")
            .select(["goods.id", "goods.name", "goods.no", "goods.basePrice", "goods.discountPrice"])
            .whereInIds(ids)
            .leftJoinAndSelect("goods.classify", "classify")
            .leftJoinAndSelect("goods.images", "image");
        if (pageNumber && pageSize) {
            if (!Number.isInteger(pageNumber) || !Number.isInteger(pageSize)) {
                throw new HttpException("分页参数错误，应为整数", 404);
            }
            queryBuilder = queryBuilder.offset((pageNumber - 1) * pageSize).limit(pageSize);
        }
        const goodses: Array<Goods> | undefined = await queryBuilder.getMany();
        return goodses;
    }

    async getTotal(ids: Array<number>): Promise<number> {
        const total: number = await this.goodsRepository.createQueryBuilder("goods").whereInIds(ids).getCount();
        return total;
    }

    async findNoExist(ids: Array<number>): Promise<{ exist: boolean, id: number | undefined }> {
        const goodses: Array<Goods> = await this.goodsRepository.findByIds(ids);
        for (let i = 0; i < ids.length; i++) {
            const exist: Goods | undefined = goodses.find(goods => goods.id === ids[i]);
            if (!exist) {
                return { exist: false, id: ids[i] };
            }
        }
        return { exist: true, id: undefined };
    }

}

export const ShopComponentToken = "ShopComponentToken";

export const ShopComponentProvider = {
    provide: ShopComponentToken,
    useFactory: (
        goodsRepository: Repository<Goods>,
        firstClassifyRepository: Repository<FirstClassify>,
        secondClassifyRepository: Repository<SecondClassify>,
        thirdClassifyRepository: Repository<ThirdClassify>
    ) => {
        return new ShopComponent(goodsRepository, firstClassifyRepository, secondClassifyRepository, thirdClassifyRepository);
    },
    inject: [getRepositoryToken(Goods), getRepositoryToken(FirstClassify), getRepositoryToken(SecondClassify), getRepositoryToken(ThirdClassify)]
};
