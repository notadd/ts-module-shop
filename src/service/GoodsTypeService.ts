import { Component, Inject, HttpException } from '@nestjs/common';
import { GoodsProperty } from '../model/GoodsProperty.entity';
import { GoodsType } from '../model/GoodsType.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Component()
export class GoodsTypeService {

    constructor(
        @InjectRepository(GoodsType) private readonly goodsTypeRepository: Repository<GoodsType>,
        @InjectRepository(GoodsProperty) private readonly goodsPropertyRepository: Repository<GoodsProperty>
    ) { }
}