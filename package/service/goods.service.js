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
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const third_classify_entity_1 = require("../model/third.classify.entity");
const property_value_entity_1 = require("../model/property.value.entity");
const goods_type_entity_1 = require("../model/goods.type.entity");
const typeorm_2 = require("@nestjs/typeorm");
const goods_entity_1 = require("../model/goods.entity");
const brand_entity_1 = require("../model/brand.entity");
let GoodsService = class GoodsService {
    constructor(connection, brandRepository, goodsRepository, goodsTypeRepository, thirdClassifyRepository, propertyValueRepository) {
        this.connection = connection;
        this.brandRepository = brandRepository;
        this.goodsRepository = goodsRepository;
        this.goodsTypeRepository = goodsTypeRepository;
        this.thirdClassifyRepository = thirdClassifyRepository;
        this.propertyValueRepository = propertyValueRepository;
    }
    getGoodses(classifyId, pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const classify = yield this.thirdClassifyRepository.findOneById(classifyId);
            if (!classify) {
                throw new common_1.HttpException("指定id=" + classifyId + "分类不存在", 404);
            }
            let queryBuilder = this.goodsRepository
                .createQueryBuilder("goods")
                .select(["goods.id", "goods.name", "goods.no", "goods.basePrice", "goods.discountPrice", "goods.description", "goods.recycle"])
                .where({ classifyId, recycle: false });
            if (pageNumber && pageSize) {
                queryBuilder = queryBuilder.offset((pageNumber - 1) * pageSize).limit(pageSize);
            }
            const goodses = yield queryBuilder.getMany();
            return goodses;
        });
    }
    getRecycleGoodses(pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            let queryBuilder = this.goodsRepository
                .createQueryBuilder("goods")
                .select(["goods.id", "goods.name", "goods.no", "goods.basePrice", "goods.discountPrice", "goods.description", "goods.recycle"])
                .where({ recycle: true });
            if (pageNumber && pageSize) {
                queryBuilder = queryBuilder.offset((pageNumber - 1) * pageSize).limit(pageSize);
            }
            const recycleGoodses = yield queryBuilder.getMany();
            return recycleGoodses;
        });
    }
    getGoods(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const goods = yield this.goodsRepository.findOneById(id, { relations: ["type", "values"] });
            if (!goods) {
                throw new common_1.HttpException("指定id=" + id + "商品不存在", 404);
            }
            return goods;
        });
    }
    createGoods(name, no, basePrice, discountPrice, description, classifyId, goodsTypeId, brandId) {
        return __awaiter(this, void 0, void 0, function* () {
            const exist = yield this.goodsRepository.findOne({ name });
            if (exist) {
                throw new common_1.HttpException("指定name=" + name + "商品已存在", 404);
            }
            const classify = yield this.thirdClassifyRepository.findOneById(classifyId);
            if (!classify) {
                throw new common_1.HttpException("指定id=" + classifyId + "分类不存在", 404);
            }
            const type = yield this.goodsTypeRepository.findOneById(goodsTypeId);
            if (!type) {
                throw new common_1.HttpException("指定id" + goodsTypeId + "商品类型不存在", 404);
            }
            let brand;
            if (brandId) {
                brand = yield this.brandRepository.findOneById(brandId);
                if (!brand) {
                    throw new common_1.HttpException("指定id" + brandId + "品牌不存在", 404);
                }
            }
            try {
                yield this.goodsRepository.save({ name, no, basePrice, discountPrice, description, classify, type, brand });
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    updateGoods(id, name, no, basePrice, discountPrice, description, classifyId, goodsTypeId, brandId) {
        return __awaiter(this, void 0, void 0, function* () {
            const goods = yield this.goodsRepository.findOneById(id, { relations: ["classify", "type", "values", "brand"] });
            if (!goods) {
                throw new common_1.HttpException("指定id=" + id + "商品不存在", 404);
            }
            if (goods.recycle) {
                throw new common_1.HttpException("指定id=" + id + "商品已经存在于回收站中，不能更新", 404);
            }
            if (name && (name !== goods.name)) {
                const exist = yield this.goodsRepository.findOne({ name });
                if (exist) {
                    throw new common_1.HttpException("指定name=" + name + "商品已存在", 404);
                }
                goods.name = name;
            }
            no && (goods.no = no);
            basePrice && (goods.basePrice = basePrice);
            discountPrice && (goods.discountPrice = discountPrice);
            description && (goods.description = description);
            if (classifyId && (classifyId !== goods.classify.id)) {
                const classify = yield this.thirdClassifyRepository.findOneById(classifyId);
                if (!classify) {
                    throw new common_1.HttpException("指定id=" + classifyId + "分类不存在", 404);
                }
                goods.classify = classify;
            }
            let changeGoodsType = false;
            if (goodsTypeId && (goodsTypeId !== goods.type.id)) {
                const type = yield this.goodsTypeRepository.findOneById(goodsTypeId);
                if (!type) {
                    throw new common_1.HttpException("指定id" + goodsTypeId + "商品类型不存在", 404);
                }
                goods.type = type;
                changeGoodsType = true;
            }
            if (brandId && (brandId !== goods.brand.id)) {
                const brand = yield this.brandRepository.findOneById(brandId);
                if (!brand) {
                    throw new common_1.HttpException("指定id" + brandId + "品牌不存在", 404);
                }
                goods.brand = brand;
            }
            const queryRunner = this.connection.createQueryRunner("master");
            try {
                yield queryRunner.startTransaction();
                if (changeGoodsType) {
                    yield queryRunner.manager.remove(goods.values);
                }
                yield queryRunner.manager.save(goods);
                yield queryRunner.commitTransaction();
            }
            catch (err) {
                yield queryRunner.rollbackTransaction();
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    deleteGoods(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const goods = yield this.goodsRepository.findOneById(id);
            if (!goods) {
                throw new common_1.HttpException("指定id=" + id + "商品不存在", 404);
            }
            if (!goods.recycle) {
                throw new common_1.HttpException("指定id=" + id + "商品不在回收站中，不能删除，需要先放入回收站中才可删除", 404);
            }
            try {
                yield this.goodsRepository.remove(goods);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    softDeleteGoods(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const goods = yield this.goodsRepository.findOneById(id);
            if (!goods) {
                throw new common_1.HttpException("指定id=" + id + "商品不存在", 404);
            }
            if (goods.recycle) {
                throw new common_1.HttpException("指定id=" + id + "商品已经存在于回收站中，不需要软删除", 404);
            }
            try {
                goods.recycle = true;
                yield this.goodsRepository.save(goods);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    softDeleteGoodses(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const goodses = yield this.goodsRepository.findByIds(ids);
            for (let i = 0; i < ids.length; i++) {
                const index = goodses.findIndex(goods => {
                    return goods.id === ids[i];
                });
                if (index < 0) {
                    throw new common_1.HttpException("指定id=" + ids[i] + "商品不存在", 404);
                }
                if (goodses[index].recycle) {
                    throw new common_1.HttpException("指定id=" + ids[i] + "商品已经存在于回收站中，不需要软删除", 404);
                }
                goodses[index].recycle = true;
            }
            try {
                yield this.goodsRepository.save(goodses);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    restoreGoods(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const goods = yield this.goodsRepository.findOneById(id);
            if (!goods) {
                throw new common_1.HttpException("指定id=" + id + "商品不存在", 404);
            }
            if (!goods.recycle) {
                throw new common_1.HttpException("指定id=" + id + "商品不在回收站中，不需要还原", 404);
            }
            try {
                goods.recycle = false;
                yield this.goodsRepository.save(goods);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    restoreGoodses(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const goodses = yield this.goodsRepository.findByIds(ids);
            for (let i = 0; i < ids.length; i++) {
                const index = goodses.findIndex(goods => {
                    return goods.id === ids[i];
                });
                if (index < 0) {
                    throw new common_1.HttpException("指定id=" + ids[i] + "商品不存在", 404);
                }
                if (!goodses[index].recycle) {
                    throw new common_1.HttpException("指定id=" + ids[i] + "商品不在回收站中，不需要还原", 404);
                }
                goodses[index].recycle = false;
            }
            try {
                yield this.goodsRepository.save(goodses);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
};
GoodsService = __decorate([
    common_1.Component(),
    __param(0, common_1.Inject(typeorm_1.Connection)),
    __param(1, typeorm_2.InjectRepository(brand_entity_1.Brand)),
    __param(2, typeorm_2.InjectRepository(goods_entity_1.Goods)),
    __param(3, typeorm_2.InjectRepository(goods_type_entity_1.GoodsType)),
    __param(4, typeorm_2.InjectRepository(third_classify_entity_1.ThirdClassify)),
    __param(5, typeorm_2.InjectRepository(property_value_entity_1.PropertyValue)),
    __metadata("design:paramtypes", [typeorm_1.Connection,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], GoodsService);
exports.GoodsService = GoodsService;
