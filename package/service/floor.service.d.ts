import { Floor } from "../model/floor.entity";
import { Goods } from "../model/goods.entity";
import { Repository } from "typeorm";
export declare class FloorService {
    private readonly goodsRepository;
    private readonly floorRepository;
    constructor(goodsRepository: Repository<Goods>, floorRepository: Repository<Floor>);
    getFloors(): Promise<Array<Floor>>;
    getFloor(id: number): Promise<Floor>;
    createFloor(name: string, display: boolean, goodsIds: Array<number>): Promise<void>;
    updateFloor(id: number, name: string, display: boolean, goodsIds: Array<number>): Promise<void>;
    deleteFloor(id: number): Promise<void>;
}
