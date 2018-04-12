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
const goods_property_entity_1 = require("../model/goods.property.entity");
const goods_entity_1 = require("../model/goods.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let PropertyValueService = class PropertyValueService {
    constructor(goodsRepository, propertyValueRepository, goodsPropertyRepository) {
        this.goodsRepository = goodsRepository;
        this.propertyValueRepository = propertyValueRepository;
        this.goodsPropertyRepository = goodsPropertyRepository;
    }
    createPropertyValue(goodsId, goodsPropertyId, value, price) {
        return __awaiter(this, void 0, void 0, function* () {
            const goodsProperty = yield this.goodsPropertyRepository.findOneById(goodsPropertyId, { relations: ["goodsType"] });
            if (!goodsProperty) {
                throw new common_1.HttpException("指定id=" + goodsPropertyId + "商品属性不存在", 404);
            }
            const goods = yield this.goodsRepository.findOneById(goodsId, { relations: ["type"] });
            if (!goods) {
                throw new common_1.HttpException("指定id=" + goodsId + "商品不存在", 404);
            }
            if (goodsProperty.goodsType.id !== goods.type.id) {
                throw new common_1.HttpException("指定商品属性id=" + goodsPropertyId + "不属于指定商品类型id=" + goods.type.id, 404);
            }
            if (goodsProperty.type === "unique" && price !== null && price !== undefined) {
                throw new common_1.HttpException("唯一属性不能指定价格", 404);
            }
            if (goodsProperty.type === "radio" && (price === null || price === undefined)) {
                throw new common_1.HttpException("单选属性必须指定价格", 404);
            }
            if (goodsProperty.type === "check" && (price === null || price === undefined)) {
                throw new common_1.HttpException("复选属性必须指定价格", 404);
            }
            if (goodsProperty.inputType === "list") {
                const v = goodsProperty.list.find(item => {
                    return item === value;
                });
                if (!v) {
                    throw new common_1.HttpException("指定商品属性值列表不包含value=" + value, 404);
                }
            }
            if (goodsProperty.type === "unique") {
                const exist = yield this.propertyValueRepository.findOne({ property: goodsProperty, goods });
                if (exist) {
                    throw new common_1.HttpException("指定商品下已存在指定唯一属性name=" + goodsProperty.name, 404);
                }
            }
            try {
                yield this.propertyValueRepository.save({ value, price, property: goodsProperty, goods });
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    updatePropertyValue(id, value, price) {
        return __awaiter(this, void 0, void 0, function* () {
            const propertyValue = yield this.propertyValueRepository.findOneById(id, { relations: ["property"] });
            if (!propertyValue) {
                throw new common_1.HttpException("指定id=" + id + "属性值不存在", 404);
            }
            value && (propertyValue.value = value);
            price !== null && price !== undefined && propertyValue.property.type !== "unique" && (propertyValue.price = price);
            try {
                yield this.propertyValueRepository.save(propertyValue);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    deletePropertyValue(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const propertyValue = yield this.propertyValueRepository.findOneById(id);
            if (!propertyValue) {
                throw new common_1.HttpException("指定id=" + id + "属性值不存在", 404);
            }
            try {
                yield this.propertyValueRepository.remove(propertyValue);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
};
PropertyValueService = __decorate([
    common_1.Component(),
    __param(0, typeorm_1.InjectRepository(goods_entity_1.Goods)),
    __param(1, typeorm_1.InjectRepository(property_value_entity_1.PropertyValue)),
    __param(2, typeorm_1.InjectRepository(goods_property_entity_1.GoodsProperty)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PropertyValueService);
exports.PropertyValueService = PropertyValueService;
