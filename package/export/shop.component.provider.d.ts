import { Repository } from "typeorm";
import { SecondClassify } from "../model/second.classify.entity";
import { ThirdClassify } from "../model/third.classify.entity";
import { FirstClassify } from "../model/first.classify.entity";
import { Goods } from "../model/goods.entity";
export declare class ShopComponent {
    private readonly goodsRepository;
    private readonly firstClassifyRepository;
    private readonly secondClassifyRepository;
    private readonly thirdClassifyRepository;
    constructor(goodsRepository: Repository<Goods>, firstClassifyRepository: Repository<FirstClassify>, secondClassifyRepository: Repository<SecondClassify>, thirdClassifyRepository: Repository<ThirdClassify>);
    getSubClassifyIds(id: number, level: 1 | 2): Promise<Array<number> | undefined>;
    getGoodsById(id: number): Promise<Goods>;
    getGoodsesByIds(ids: Array<number>, pageNumber: number, pageSize: number): Promise<Array<Goods>>;
    getTotal(ids: Array<number>): Promise<number>;
    findNoExist(ids: Array<number>): Promise<{
        exist: boolean;
        id: number | undefined;
    }>;
}
export declare const ShopComponentToken = "ShopComponentToken";
export declare const ShopComponentProvider: {
    provide: string;
    useFactory: (goodsRepository: Repository<Goods>, firstClassifyRepository: Repository<FirstClassify>, secondClassifyRepository: Repository<SecondClassify>, thirdClassifyRepository: Repository<ThirdClassify>) => ShopComponent;
    inject: string[];
};
