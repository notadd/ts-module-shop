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
const sku_service_1 = require("../service/sku.service");
let SkuResolver = class SkuResolver {
    constructor(skuService) {
        this.skuService = skuService;
    }
    skus(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { goodsId } = body;
            if (!goodsId) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            const skus = yield this.skuService.getSkus(goodsId);
            return { code: 200, message: "获取指定商品Sku成功", skus };
        });
    }
    createSku(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { goodsId, no, inventory, propertyValueIds } = body;
            if (!goodsId || !no || !inventory || !propertyValueIds || propertyValueIds.length === 0) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            yield this.skuService.createSku(goodsId, no, inventory, propertyValueIds);
            return { code: 200, message: "创建Sku成功" };
        });
    }
    updateSku(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, no, inventory, propertyValueIds } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            yield this.skuService.updateSku(id, no, inventory, propertyValueIds);
            return { code: 200, message: "更新Sku成功" };
        });
    }
    deleteSku(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            yield this.skuService.deleteSku(id);
            return { code: 200, message: "删除Sku成功" };
        });
    }
};
__decorate([
    graphql_1.Query("skus"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SkuResolver.prototype, "skus", null);
__decorate([
    graphql_1.Mutation("createSku"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SkuResolver.prototype, "createSku", null);
__decorate([
    graphql_1.Mutation("updateSku"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SkuResolver.prototype, "updateSku", null);
__decorate([
    graphql_1.Mutation("deleteSku"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SkuResolver.prototype, "deleteSku", null);
SkuResolver = __decorate([
    graphql_1.Resolver("Sku"),
    common_1.UseInterceptors(exception_interceptor_1.ExceptionInterceptor),
    __param(0, common_1.Inject(sku_service_1.SkuService)),
    __metadata("design:paramtypes", [sku_service_1.SkuService])
], SkuResolver);
exports.SkuResolver = SkuResolver;
