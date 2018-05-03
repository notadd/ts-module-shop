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

}
