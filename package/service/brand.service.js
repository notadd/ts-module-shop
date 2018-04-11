"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const brand_entity_1 = require("../model/brand.entity");
const typeorm_2 = require("typeorm");
let BrandService = class BrandService {
    constructor(brandRepository) {
        this.brandRepository = brandRepository;
    }
    getBrands() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.brandRepository.find();
        });
    }
    createBrand(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const exist = yield this.brandRepository.findOne({ name });
            if (exist) {
                throw new common_1.HttpException("指定name=" + name + "品牌已存在", 404);
            }
            try {
                yield this.brandRepository.save({ name });
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    updateBrand(id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const brand = yield this.brandRepository.findOneById(id);
            if (!brand) {
                throw new common_1.HttpException("指定id=" + id + "品牌不存在", 404);
            }
            if (name && (name !== brand.name)) {
                const exist = yield this.brandRepository.findOne({ name });
                if (exist) {
                    throw new common_1.HttpException("指定name=" + name + "品牌已存在", 404);
                }
                brand.name = name;
            }
            try {
                yield this.brandRepository.save(brand);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    deleteBrand(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const brand = yield this.brandRepository.findOneById(id, { relations: ["goodses"] });
            if (!brand) {
                throw new common_1.HttpException("指定id=" + id + "品牌不存在", 404);
            }
            if (brand.goodses && brand.goodses.length > 0) {
                throw new common_1.HttpException("指定品牌下存在商品不允许删除", 404);
            }
            try {
                yield this.brandRepository.remove(brand);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
};
BrandService = __decorate([
    common_1.Component(),
    __param(0, typeorm_1.InjectRepository(brand_entity_1.Brand)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BrandService);
exports.BrandService = BrandService;
//# sourceMappingURL=brand.service.js.map