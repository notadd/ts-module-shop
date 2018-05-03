import { Component, HttpException, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Floor } from "../model/floor.entity";
import { Repository } from "typeorm";
import { Request } from "express";

/* 楼层的服务组件 */
@Component()
export class FloorService {

    constructor(
        @InjectRepository(Floor) private readonly floorRepository: Repository<Floor>
    ) { }

}