import { GoodsProperty } from "../model/goods.property.entity";
import { Repository, Connection } from "typeorm";
import { GoodsType } from "../model/goods.type.entity";
export declare class GoodsPropertyService {
    private readonly connection;
    private readonly goodsTypeRepository;
    private readonly goodsPropertyRepository;
    constructor(connection: Connection, goodsTypeRepository: Repository<GoodsType>, goodsPropertyRepository: Repository<GoodsProperty>);
    createGoodsProperty(goodsTypeId: number, name: string, type: string, inputType: string, list: Array<string>): Promise<void>;
    updateGoodsProperty(id: number, name: string, type: string, inputType: string, list: Array<string>): Promise<void>;
    deleteGoodsProperty(id: number): Promise<void>;
}
