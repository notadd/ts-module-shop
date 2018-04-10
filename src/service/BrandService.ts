import { Component, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from '../model/Brand.entity';
import { Repository } from 'typeorm';


@Component()
export class BrandService {

    constructor(
        @InjectRepository(Brand) private readonly brandRepository: Repository<Brand>
    ) { }

    async createBrand(name: string): Promise<void> {
        let exist: Brand = await this.brandRepository.findOne({ name })
        if (exist) {
            throw new HttpException('指定name=' + name + '品牌已存在', 404)
        }
        try {
            await this.brandRepository.save({ name })
        } catch (err) {
            throw new HttpException('发生了数据库错误' + err.toString(), 403)
        }
    }

    async updateBrand(id: number, name: string): Promise<void> {
        let brand: Brand = await this.brandRepository.findOneById(id)
        if (!brand) {
            throw new HttpException('指定id=' + id + '品牌不存在', 404)
        }
        if (name && (name !== brand.name)) {
            let exist: Brand = await this.brandRepository.findOne({ name })
            if (exist) {
                throw new HttpException('指定name=' + name + '品牌已存在', 404)
            }
            brand.name = name
        }
        try {
            await this.brandRepository.save(brand)
        } catch (err) {
            throw new HttpException('发生了数据库错误' + err.toString(), 403)
        }
    }

}