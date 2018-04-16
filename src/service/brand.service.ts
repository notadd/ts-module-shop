import { Component, HttpException, Inject } from "@nestjs/common";
import { StoreComponent } from "../interface/store.component";
import { BrandLogo } from "../model/brand.logo.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Brand } from "../model/brand.entity";
import { Repository } from "typeorm";

/* 品牌的服务组件 */
@Component()
export class BrandService {

    constructor(
        @InjectRepository(Brand) private readonly brandRepository: Repository<Brand>,
        @Inject("StoreComponentToken") private readonly storeComponent: StoreComponent,
        @InjectRepository(BrandLogo) private readonly brandLogoRepository: Repository<BrandLogo>
    ) { }

    /* 获取当前所有品牌 */
    async getBrands(): Promise<Array<Brand>> {
        return this.brandRepository.find();
    }

    /* 创建指定名称品牌，名称已存在抛出异常 */
    async createBrand(name: string, logo: { bucketName: string, rawName: string, base64: string }): Promise<void> {
        const exist: Brand | undefined = await this.brandRepository.findOne({ name });
        if (exist) {
            throw new HttpException("指定name=" + name + "品牌已存在", 404);
        }
        const { name: fileName, type } = await this.storeComponent.upload(logo.bucketName, logo.rawName, logo.base64, undefined);
        try {
            const brand: Brand = await this.brandRepository.save({ name } as Brand);
            await this.brandLogoRepository.save({ bucketName: logo.bucketName, name: fileName, type, brand });
        } catch (err) {
            await this.storeComponent.delete(logo.bucketName, name, type);
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

    /* 更新指定id品牌，品牌不存在或者新名称已存在，抛出异常 */
    async updateBrand(id: number, name: string): Promise<void> {
        const brand: Brand | undefined = await this.brandRepository.findOneById(id);
        if (!brand) {
            throw new HttpException("指定id=" + id + "品牌不存在", 404);
        }
        if (name && (name !== brand.name)) {
            const exist: Brand | undefined = await this.brandRepository.findOne({ name });
            if (exist) {
                throw new HttpException("指定name=" + name + "品牌已存在", 404);
            }
            brand.name = name;
        }
        try {
            await this.brandRepository.save(brand);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

    /* 删除指定id品牌，品牌不存在或者品牌下存在商品，抛出异常 */
    async deleteBrand(id: number): Promise<void> {
        const brand: Brand | undefined = await this.brandRepository.findOneById(id, { relations: ["goodses"] });
        if (!brand) {
            throw new HttpException("指定id=" + id + "品牌不存在", 404);
        }
        if (brand.goodses && brand.goodses.length > 0) {
            throw new HttpException("指定品牌下存在商品不允许删除", 404);
        }
        try {
            await this.brandRepository.remove(brand);
        } catch (err) {
            throw new HttpException("发生了数据库错误" + err.toString(), 403);
        }
    }

}