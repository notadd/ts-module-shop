import { PropertyValue } from "../model/property.value.entity";
import { GoodsProperty } from "../model/goods.property.entity";
import { Goods } from "../model/goods.entity";
import { Repository } from "typeorm";
export declare class PropertyValueService {
    private readonly goodsRepository;
    private readonly propertyValueRepository;
    private readonly goodsPropertyRepository;
    constructor(goodsRepository: Repository<Goods>, propertyValueRepository: Repository<PropertyValue>, goodsPropertyRepository: Repository<GoodsProperty>);
    createPropertyValue(goodsId: number, goodsPropertyId: number, value: string, price: number): Promise<void>;
    updatePropertyValue(id: number, value: string, price: number): Promise<void>;
    deletePropertyValue(id: number): Promise<void>;
}
