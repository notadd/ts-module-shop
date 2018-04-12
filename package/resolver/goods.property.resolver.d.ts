/// <reference types="express" />
import { GoodsPropertyService } from "../service/goods.property.service";
import { Data } from "../interface/data";
import { Request } from "express";
export declare class GoodsPropertyResolver {
    private readonly goodsPropertyService;
    constructor(goodsPropertyService: GoodsPropertyService);
    createGoodsProperty(req: Request, body: {
        goodsTypeId: number;
        name: string;
        type: "unique" | "radio" | "check";
        inputType: "text" | "list" | "textarea";
        list: Array<string>;
    }): Promise<Data>;
    updateGoodsProperty(req: Request, body: {
        id: number;
        name: string;
        type: "unique" | "radio" | "check";
        inputType: "text" | "list" | "textarea";
        list: Array<string>;
    }): Promise<Data>;
    deleteGoodsProperty(req: Request, body: {
        id: number;
    }): Promise<Data>;
}
