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
const goods_property_entity_1 = require("../model/goods.property.entity");
const typeorm_1 = require("typeorm");
const goods_type_entity_1 = require("../model/goods.type.entity");
const typeorm_2 = require("@nestjs/typeorm");
let GoodsPropertyService = class GoodsPropertyService {
    constructor(connection, goodsTypeRepository, goodsPropertyRepository) {
        this.connection = connection;
        this.goodsTypeRepository = goodsTypeRepository;
        this.goodsPropertyRepository = goodsPropertyRepository;
    }
    createGoodsProperty(goodsTypeId, name, type, inputType, list) {
        return __awaiter(this, void 0, void 0, function* () {
            const goodsType = yield this.goodsTypeRepository.findOne(goodsTypeId);
            if (!goodsType) {
                throw new common_1.HttpException("指定id=" + goodsTypeId + "商品类型不存在", 404);
            }
            const exist = yield this.goodsPropertyRepository.findOne({ name, goodsType });
            if (exist) {
                throw new common_1.HttpException("指定id" + goodsTypeId + "商品类型下已存在name=" + name + "商品属性", 404);
            }
            const goodsProperty = this.goodsPropertyRepository.create({ name, type, inputType, goodsType });
            if (inputType === "list") {
                goodsProperty.list = list;
            }
            try {
                yield this.goodsPropertyRepository.save(goodsProperty);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    updateGoodsProperty(id, name, type, inputType, list) {
        return __awaiter(this, void 0, void 0, function* () {
            const goodsProperty = yield this.goodsPropertyRepository.findOne(id, { relations: ["goodsType", "values"] });
            if (!goodsProperty) {
                throw new common_1.HttpException("指定id=" + id + "商品属性不存在", 404);
            }
            let ischange = false;
            if (name && name !== goodsProperty.name) {
                const exist = yield this.goodsPropertyRepository.findOne({ name, goodsType: goodsProperty.goodsType });
                if (exist) {
                    throw new common_1.HttpException("指定name=" + name + "商品属性已存在于所属商品类型下", 404);
                }
                goodsProperty.name = name;
                ischange = true;
            }
            if (type && goodsProperty.type !== type) {
                goodsProperty.type = type;
                ischange = true;
            }
            if (inputType && goodsProperty.inputType !== inputType) {
                goodsProperty.inputType = inputType;
                ischange = true;
            }
            if (goodsProperty.inputType === "list") {
                goodsProperty.list.forEach(item => {
                    const find = list.find(i => {
                        return i === item;
                    });
                    if (!find) {
                        ischange = true;
                    }
                });
                goodsProperty.list = list;
            }
            else {
                goodsProperty.list = [];
            }
            const queryRunner = this.connection.createQueryRunner("master");
            try {
                yield queryRunner.startTransaction();
                if (ischange) {
                    yield queryRunner.manager.remove(goodsProperty.values);
                }
                yield queryRunner.manager.save(goodsProperty);
                yield queryRunner.commitTransaction();
            }
            catch (err) {
                yield queryRunner.rollbackTransaction();
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    deleteGoodsProperty(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const goodsProperty = yield this.goodsPropertyRepository.findOne(id, { relations: ["goodsType"] });
            if (!goodsProperty) {
                throw new common_1.HttpException("指定id=" + id + "商品属性不存在", 404);
            }
            try {
                yield this.goodsPropertyRepository.remove(goodsProperty);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
};
GoodsPropertyService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(typeorm_1.Connection)),
    __param(1, typeorm_2.InjectRepository(goods_type_entity_1.GoodsType)),
    __param(2, typeorm_2.InjectRepository(goods_property_entity_1.GoodsProperty)),
    __metadata("design:paramtypes", [typeorm_1.Connection,
        typeorm_1.Repository,
        typeorm_1.Repository])
], GoodsPropertyService);
exports.GoodsPropertyService = GoodsPropertyService;

//# sourceMappingURL=goods.property.service.js.map
