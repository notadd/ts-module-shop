import { Component, Inject, HttpException } from '@nestjs/common';
import { PropertyValue } from '../model/PropertyValue.entity';
import { GoodsProperty } from '../model/GoodsProperty.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Component()
export class PropertyValueService {

    constructor(
        @InjectRepository(PropertyValue) private readonly propertyValueRepository: Repository<PropertyValue>,
        @InjectRepository(GoodsProperty) private readonly goodsPropertyRepository: Repository<GoodsProperty>
    ) { }
}