import { GoodsType } from "../model/goods.type.entity";
import { Repository } from "typeorm";
export declare class GoodsTypeService {
    private readonly goodsTypeRepository;
    constructor(goodsTypeRepository: Repository<GoodsType>);
    getGoodsType(id: number): Promise<GoodsType>;
    getGoodsTypes(): Promise<Array<GoodsType>>;
    createGoodsType(name: string): Promise<void>;
    updateGoodsType(id: number, name: string): Promise<void>;
    deleteGoodsType(id: number): Promise<void>;
}
