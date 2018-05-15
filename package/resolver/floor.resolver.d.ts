/// <reference types="express" />
import { FloorsData } from "../interface/floor/floors.data";
import { FloorData } from "../interface/floor/floor.data";
import { FloorService } from "../service/floor.service";
import { Data } from "../interface/data";
import { Request } from "express";
export declare class FloorResolver {
    private readonly floorService;
    constructor(floorService: FloorService);
    floors(req: Request): Promise<FloorsData>;
    floor(req: Request, body: {
        id: number;
    }): Promise<FloorData>;
    createFloor(req: Request, body: {
        name: string;
        display: boolean;
        goodsIds: Array<number>;
    }): Promise<Data>;
    updateFloor(req: Request, body: {
        id: number;
        name: string;
        display: boolean;
        goodsIds: Array<number>;
    }): Promise<Data>;
    deleteFloor(req: Request, body: {
        id: number;
    }): Promise<Data>;
}
