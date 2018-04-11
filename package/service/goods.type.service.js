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
const goods_type_entity_1 = require("../model/goods.type.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let GoodsTypeService = class GoodsTypeService {
    constructor(goodsTypeRepository) {
        this.goodsTypeRepository = goodsTypeRepository;
    }
    getGoodsType(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const goodsType = yield this.goodsTypeRepository.findOneById(id, { relations: ["properties"] });
            if (!goodsType) {
                throw new common_1.HttpException("指定id=" + id + "商品类型不存在", 404);
            }
            return goodsType;
        });
    }
    getGoodsTypes() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.goodsTypeRepository.find();
        });
    }
    createGoodsType(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const exist = yield this.goodsTypeRepository.findOne({ name });
            if (exist) {
                throw new common_1.HttpException("指定name=" + name + "商品类型已存在", 404);
            }
            try {
                yield this.goodsTypeRepository.save({ name });
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    updateGoodsType(id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const goodsType = yield this.goodsTypeRepository.findOneById(id);
            if (!goodsType) {
                throw new common_1.HttpException("指定id=" + id + "商品类型不存在", 404);
            }
            if (name && (name !== goodsType.name)) {
                const exist = yield this.goodsTypeRepository.findOne({ name });
                if (exist) {
                    throw new common_1.HttpException("指定name=" + name + "商品类型已存在", 404);
                }
                goodsType.name = name;
            }
            try {
                yield this.goodsTypeRepository.save(goodsType);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    deleteGoodsType(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const goodsType = yield this.goodsTypeRepository.findOneById(id, { relations: ["properties", "goodses"] });
            if (!goodsType) {
                throw new common_1.HttpException("指定id=" + id + "商品类型不存在", 404);
            }
            if (goodsType.goodses && goodsType.goodses.length > 0) {
                throw new common_1.HttpException("指定商品类型下存在商品，请先将商品移动到其他商品类型下再删除", 404);
            }
            try {
                yield this.goodsTypeRepository.remove(goodsType);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
};
GoodsTypeService = __decorate([
    common_1.Component(),
    __param(0, typeorm_1.InjectRepository(goods_type_entity_1.GoodsType)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GoodsTypeService);
exports.GoodsTypeService = GoodsTypeService;
//# sourceMappingURL=goods.type.service.js.map