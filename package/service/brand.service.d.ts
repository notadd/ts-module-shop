import { Brand } from "../model/brand.entity";
import { Repository } from "typeorm";
export declare class BrandService {
    private readonly brandRepository;
    constructor(brandRepository: Repository<Brand>);
    getBrands(): Promise<Array<Brand>>;
    createBrand(name: string): Promise<void>;
    updateBrand(id: number, name: string): Promise<void>;
    deleteBrand(id: number): Promise<void>;
}
