import { HttpException } from "@nestjs/common";
import { Repository, Connection } from "typeorm";
import { Goods } from "../model/goods.entity";


export class ShopComponent {

    constructor(
        private readonly goodsRepository: Repository<Goods>
    ) { }

    async getGoodsById(id: number): Promise<Goods> {
        const goods: Goods | undefined = await this.goodsRepository.createQueryBuilder("goods")
            .select(["goods.id", "goods.name", "goods.basePrice", "goods.discountPrice"])
            .where({ id, recycle: false })
            .leftJoinAndSelect("goods.classify", "classify")
            .leftJoinAndSelect("goods.images", "image")
            .getOne();
        return goods;
    }

    async getTotal(ids: Array<number>): Promise<number> {
        const total: number = await this.goodsRepository.createQueryBuilder("goods").whereInIds(ids).getCount();
        return total;
    }

    async findNoExist(ids: Array<number>): Promise<{ exist: boolean, id: number }> {
        const goodses: Array<Goods> = await this.goodsRepository.findByIds(ids);
        for (let i = 0; i < ids.length; i++) {
            const exist: Goods = goodses.find(goods => goods.id === ids[i]);
            if (!exist) {
                return { exist: false, id: ids[i] };
            }
        }
        return { exist: true, id: undefined };
    }

}

export const ShopComponentProvider = {
    provide: "ShopComponentToken",
    useFactory: (goodsRepository: Repository<Goods>) => {
        return new ShopComponent(goodsRepository);
    },
    inject: ["GoodsRepository"]
};