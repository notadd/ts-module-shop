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
const exception_interceptor_1 = require("../interceptor/exception.interceptor");
const common_1 = require("@nestjs/common");
const goods_type_service_1 = require("../service/goods.type.service");
const graphql_1 = require("@nestjs/graphql");
let GoodsTypeResolver = class GoodsTypeResolver {
    constructor(goodsTypeService) {
        this.goodsTypeService = goodsTypeService;
    }
    goodsTypes(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const goodsTypes = yield this.goodsTypeService.getGoodsTypes();
            return { code: 200, message: "获取所有商品类型成功", goodsTypes };
        });
    }
    goodsType(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            const goodsType = yield this.goodsTypeService.getGoodsType(id);
            return { code: 200, message: "获取指定商品类型信息成功", goodsType };
        });
    }
    createGoodsType(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = body;
            if (!name) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            yield this.goodsTypeService.createGoodsType(name);
            return { code: 200, message: "创建商品类型成功" };
        });
    }
    updateGoodsType(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            yield this.goodsTypeService.updateGoodsType(id, name);
            return { code: 200, message: "更新商品类型成功" };
        });
    }
    deleteGoodsType(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            yield this.goodsTypeService.deleteGoodsType(id);
            return { code: 200, message: "删除商品类型成功" };
        });
    }
};
__decorate([
    graphql_1.Query("goodsTypes"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GoodsTypeResolver.prototype, "goodsTypes", null);
__decorate([
    graphql_1.Query("goodsType"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GoodsTypeResolver.prototype, "goodsType", null);
__decorate([
    graphql_1.Mutation("createGoodsType"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GoodsTypeResolver.prototype, "createGoodsType", null);
__decorate([
    graphql_1.Mutation("updateGoodsType"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GoodsTypeResolver.prototype, "updateGoodsType", null);
__decorate([
    graphql_1.Mutation("deleteGoodsType"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GoodsTypeResolver.prototype, "deleteGoodsType", null);
GoodsTypeResolver = __decorate([
    graphql_1.Resolver("GoodsTyoe"),
    common_1.UseInterceptors(exception_interceptor_1.ExceptionInterceptor),
    __param(0, common_1.Inject(goods_type_service_1.GoodsTypeService)),
    __metadata("design:paramtypes", [goods_type_service_1.GoodsTypeService])
], GoodsTypeResolver);
exports.GoodsTypeResolver = GoodsTypeResolver;
