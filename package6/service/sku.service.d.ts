import { PropertyValue } from "../model/property.value.entity";
import { Goods } from "../model/goods.entity";
import { Sku } from "../model/sku.entity";
import { Repository } from "typeorm";
export declare class SkuService {
    private readonly skuRepository;
    private readonly goodsRepository;
    private readonly propertyValueRepository;
    constructor(skuRepository: Repository<Sku>, goodsRepository: Repository<Goods>, propertyValueRepository: Repository<PropertyValue>);
    getSkus(goodsId: number): Promise<Array<Sku>>;
    createSku(goodsId: number, no: string, inventory: number, propertyValueIds: Array<number>): Promise<void>;
    updateSku(id: number, no: string, inventory: number, propertyValueIds: Array<number>): Promise<void>;
    deleteSku(id: number): Promise<void>;
}
