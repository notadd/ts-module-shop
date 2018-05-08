/// <reference types="express" />
import { PropertyValuesData } from "../interface/propertyvalue/property.values.data";
import { PropertyValueService } from "../service/property.value.service";
import { Data } from "../interface/data";
import { Request } from "express";
export declare class PropertyValueResolver {
    private readonly propertyValueService;
    constructor(propertyValueService: PropertyValueService);
    propertyValues(req: Request, body: {
        goodsId: number;
    }): Promise<PropertyValuesData>;
    createPropertyValue(req: Request, body: {
        goodsId: number;
        goodsPropertyId: number;
        value: string;
        price: number;
    }): Promise<Data>;
    updatePropertyValue(req: Request, body: {
        id: number;
        value: string;
        price: number;
    }): Promise<Data>;
    deletePropertyValue(req: Request, body: {
        id: number;
    }): Promise<Data>;
}
