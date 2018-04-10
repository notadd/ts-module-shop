import { Component, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from '../model/Brand.entity';
import { Repository } from 'typeorm';


@Component()
export class BrandService {

    constructor(
        @InjectRepository(Brand) private readonly brandRepository: Repository<Brand>
    ) { }

}