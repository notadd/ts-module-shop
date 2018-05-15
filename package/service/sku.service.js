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
const property_value_entity_1 = require("../model/property.value.entity");
const typeorm_1 = require("@nestjs/typeorm");
const goods_entity_1 = require("../model/goods.entity");
const sku_entity_1 = require("../model/sku.entity");
const typeorm_2 = require("typeorm");
let SkuService = class SkuService {
    constructor(skuRepository, goodsRepository, propertyValueRepository) {
        this.skuRepository = skuRepository;
        this.goodsRepository = goodsRepository;
        this.propertyValueRepository = propertyValueRepository;
    }
    getSkus(goodsId) {
        return __awaiter(this, void 0, void 0, function* () {
            const goods = yield this.goodsRepository.createQueryBuilder("goods")
                .where({ id: goodsId })
                .leftJoinAndSelect("goods.skus", "sku")
                .leftJoinAndSelect("sku.values", "value")
                .leftJoinAndSelect("value.property", "property")
                .getOne();
            if (!goods) {
                throw new common_1.HttpException("指定id=" + goodsId + "商品不存在", 404);
            }
            return goods.skus;
        });
    }
    createSku(goodsId, no, inventory, propertyValueIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const goods = yield this.goodsRepository.findOne(goodsId);
            if (!goods) {
                throw new common_1.HttpException("指定id=" + goodsId + "商品不存在", 404);
            }
            const values = yield this.propertyValueRepository.findByIds(propertyValueIds, { relations: ["property", "goods"] });
            for (let i = 0; i < propertyValueIds.length; i++) {
                const find = values.find(value => value.id === propertyValueIds[i]);
                if (!find) {
                    throw new common_1.HttpException("指定id=" + propertyValueIds[i] + "属性值不存在", 404);
                }
                if (find.goods.id !== goods.id) {
                    throw new common_1.HttpException("指定id=" + propertyValueIds[i] + "属性值不存在于指定id=" + goods.id + "商品之下", 404);
                }
                if (find.property.type !== "radio") {
                    throw new common_1.HttpException("指定id=" + propertyValueIds[i] + "属性值的属性不是单选类型，只有单选类型属性值可以作为sku添加", 404);
                }
            }
            try {
                yield this.skuRepository.save({ no, inventory, goods, values });
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    updateSku(id, no, inventory, propertyValueIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const sku = yield this.skuRepository.findOne(id, { relations: ["goods", "values"] });
            if (!sku) {
                throw new common_1.HttpException("指定id=" + id + "Sku不存在", 404);
            }
            if (no) {
                sku.no = no;
            }
            if (inventory) {
                sku.inventory = inventory;
            }
            if (propertyValueIds && propertyValueIds.length !== 0) {
                const values = yield this.propertyValueRepository.findByIds(propertyValueIds, { relations: ["property", "goods"] });
                for (let i = 0; i < propertyValueIds.length; i++) {
                    const find = values.find(value => value.id === propertyValueIds[i]);
                    if (!find) {
                        throw new common_1.HttpException("指定id=" + propertyValueIds[i] + "属性值不存在", 404);
                    }
                    if (find.goods.id !== sku.goods.id) {
                        throw new common_1.HttpException("指定id=" + propertyValueIds[i] + "属性值不存在于指定id=" + sku.goods.id + "商品之下", 404);
                    }
                    if (find.property.type !== "radio") {
                        throw new common_1.HttpException("指定id=" + propertyValueIds[i] + "属性值的属性不是单选类型，只有单选类型属性值可以作为sku添加", 404);
                    }
                }
                sku.values = values;
            }
            try {
                yield this.skuRepository.save(sku);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    deleteSku(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const sku = yield this.skuRepository.findOne(id, { relations: ["values"] });
            if (!sku) {
                throw new common_1.HttpException("指定id=" + id + "Sku不存在", 404);
            }
            try {
                sku.values = undefined;
                yield this.skuRepository.save(sku);
                yield this.skuRepository.remove(sku);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
};
SkuService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(sku_entity_1.Sku)),
    __param(1, typeorm_1.InjectRepository(goods_entity_1.Goods)),
    __param(2, typeorm_1.InjectRepository(property_value_entity_1.PropertyValue)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SkuService);
exports.SkuService = SkuService;

//# sourceMappingURL=sku.service.js.map
