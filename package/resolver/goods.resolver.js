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
const graphql_1 = require("@nestjs/graphql");
const goods_service_1 = require("../service/goods.service");
let GoodsResolver = class GoodsResolver {
    constructor(goodsService) {
        this.goodsService = goodsService;
    }
    goodses(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { classifyId, pageNumber, pageSize } = body;
            if (!classifyId) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            const goodses = yield this.goodsService.getGoodses(classifyId, pageNumber, pageSize);
            return { code: 200, message: "获取指定分类商品成功", goodses };
        });
    }
    recycleGoodses(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize } = body;
            const recycleGoodses = yield this.goodsService.getRecycleGoodses(pageNumber, pageSize);
            return { code: 200, message: "获取指定分类商品成功", recycleGoodses };
        });
    }
    goods(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            const goods = yield this.goodsService.getGoods(id);
            return { code: 200, message: "获取指定商品详情成功", goods };
        });
    }
    createGoods(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, no, basePrice, discountPrice, description, classifyId, goodsTypeId, brandId } = body;
            if (!name || !no || !basePrice || !description || !classifyId || !goodsTypeId) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.goodsService.createGoods(name, no, basePrice, discountPrice, description, classifyId, goodsTypeId, brandId);
            return { code: 200, message: "创建商品成功" };
        });
    }
    updateGoods(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, no, basePrice, discountPrice, description, classifyId, goodsTypeId, brandId } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.goodsService.updateGoods(id, name, no, basePrice, discountPrice, description, classifyId, goodsTypeId, brandId);
            return { code: 200, message: "更新商品成功" };
        });
    }
    deleteGoods(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.goodsService.deleteGoods(id);
            return { code: 200, message: "删除商品成功" };
        });
    }
    softDeleteGoods(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.goodsService.softDeleteGoods(id);
            return { code: 200, message: "商品放入回收站成功" };
        });
    }
    softDeleteGoodses(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ids } = body;
            if (!ids || ids.length === 0) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.goodsService.softDeleteGoodses(ids);
            return { code: 200, message: "多个商品放入回收站成功" };
        });
    }
    restoreGoods(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.goodsService.restoreGoods(id);
            return { code: 200, message: "商品还原成功" };
        });
    }
    restoreGoodses(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ids } = body;
            if (!ids || ids.length === 0) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.goodsService.restoreGoodses(ids);
            return { code: 200, message: "多个商品还原成功" };
        });
    }
};
__decorate([
    graphql_1.Query("goodses"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GoodsResolver.prototype, "goodses", null);
__decorate([
    graphql_1.Query("recycleGoodses"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GoodsResolver.prototype, "recycleGoodses", null);
__decorate([
    graphql_1.Query("goods"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GoodsResolver.prototype, "goods", null);
__decorate([
    graphql_1.Mutation("createGoods"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GoodsResolver.prototype, "createGoods", null);
__decorate([
    graphql_1.Mutation("updateGoods"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GoodsResolver.prototype, "updateGoods", null);
__decorate([
    graphql_1.Mutation("deleteGoods"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GoodsResolver.prototype, "deleteGoods", null);
__decorate([
    graphql_1.Mutation("softDeleteGoods"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GoodsResolver.prototype, "softDeleteGoods", null);
__decorate([
    graphql_1.Mutation("softDeleteGoodses"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GoodsResolver.prototype, "softDeleteGoodses", null);
__decorate([
    graphql_1.Mutation("restoreGoods"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GoodsResolver.prototype, "restoreGoods", null);
__decorate([
    graphql_1.Mutation("restoreGoodses"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GoodsResolver.prototype, "restoreGoodses", null);
GoodsResolver = __decorate([
    graphql_1.Resolver("Goods"),
    common_1.UseInterceptors(exception_interceptor_1.ExceptionInterceptor),
    __param(0, common_1.Inject(goods_service_1.GoodsService)),
    __metadata("design:paramtypes", [goods_service_1.GoodsService])
], GoodsResolver);
exports.GoodsResolver = GoodsResolver;
