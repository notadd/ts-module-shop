import { Repository, Connection } from "typeorm";
import { ThirdClassify } from "../model/third.classify.entity";
import { PropertyValue } from "../model/property.value.entity";
import { GoodsType } from "../model/goods.type.entity";
import { Goods } from "../model/goods.entity";
import { Brand } from "../model/brand.entity";
export declare class GoodsService {
    private readonly connection;
    private readonly brandRepository;
    private readonly goodsRepository;
    private readonly goodsTypeRepository;
    private readonly thirdClassifyRepository;
    private readonly propertyValueRepository;
    constructor(connection: Connection, brandRepository: Repository<Brand>, goodsRepository: Repository<Goods>, goodsTypeRepository: Repository<GoodsType>, thirdClassifyRepository: Repository<ThirdClassify>, propertyValueRepository: Repository<PropertyValue>);
    getGoodses(classifyId: number, pageNumber: number, pageSize: number): Promise<Array<Goods>>;
    getGoods(id: number): Promise<Goods>;
    createGoods(name: string, basePrice: number, description: string, classifyId: number, goodsTypeId: number, brandId: number): Promise<void>;
    updateGoods(id: number, name: string, basePrice: number, description: string, classifyId: number, goodsTypeId: number, brandId: number): Promise<void>;
    deleteGoods(id: number): Promise<void>;
}
