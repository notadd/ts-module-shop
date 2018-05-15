/// <reference types="express" />
import { StoreComponent } from "../interface/store.component";
import { BrandLogo } from "../model/brand.logo.entity";
import { Brand } from "../model/brand.entity";
import { Repository } from "typeorm";
import { Request } from "express";
export declare class BrandService {
    private readonly brandRepository;
    private readonly storeComponent;
    private readonly brandLogoRepository;
    constructor(brandRepository: Repository<Brand>, storeComponent: StoreComponent, brandLogoRepository: Repository<BrandLogo>);
    getBrands(req: Request): Promise<Array<Brand>>;
    createBrand(name: string, logo: {
        bucketName: string;
        rawName: string;
        base64: string;
    }): Promise<void>;
    updateBrand(id: number, name: string, logo: {
        bucketName: string;
        rawName: string;
        base64: string;
    }): Promise<void>;
    deleteBrand(id: number): Promise<void>;
}
