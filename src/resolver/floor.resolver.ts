import { ExceptionInterceptor } from "../interceptor/exception.interceptor";
import { Inject, HttpException, UseInterceptors } from "@nestjs/common";
import { Resolver, Query, Mutation } from "@nestjs/graphql";
import { FloorService } from "../service/floor.service";
import { Data } from "../interface/data";
import { Request } from "express";

/* 楼层设置的Resolver */
@Resolver("Floor")
@UseInterceptors(ExceptionInterceptor)
export class FloorResolver {

    constructor(@Inject(FloorService) private readonly floorService: FloorService) { }

    @Mutation("createFloor")
    async createFloor(req: Request, body: { name: string, display: string, goodsIds: Array<number> }): Promise<Data> {
        const { name, display, goodsIds } = body;
        if (!name || display === undefined || display === null || !goodsIds || goodsIds.length === 0) {
            throw new HttpException("缺少参数", 404);
        }
        await this.floorService.createFloor(name, display, goodsIds);
        return { code: 200, message: "创建楼层成功" };
    }

    @Mutation("updateFloor")
    async updateFloor(req: Request, body: { id: number, name: string, display: string, goodsIds: Array<number> }): Promise<Data> {
        const { id, name, display, goodsIds } = body;
        if (!id || !name || display === undefined || display === null || !goodsIds || goodsIds.length === 0) {
            throw new HttpException("缺少参数", 404);
        }
        await this.floorService.updateFloor(id, name, display, goodsIds);
        return { code: 200, message: "更新楼层成功" };
    }

}
