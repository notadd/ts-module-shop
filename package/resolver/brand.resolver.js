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
const brand_service_1 = require("../service/brand.service");
let BrandResolver = class BrandResolver {
    constructor(brandService) {
        this.brandService = brandService;
    }
    brands(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const brands = yield this.brandService.getBrands(req);
            return { code: 200, message: "获取所有品牌成功", brands };
        });
    }
    createBrand(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, logo } = body;
            if (!name || !logo || !logo.bucketName || !logo.rawName || !logo.base64) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            yield this.brandService.createBrand(name, logo);
            return { code: 200, message: "创建品牌成功" };
        });
    }
    updateBrand(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, logo } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            yield this.brandService.updateBrand(id, name, logo);
            return { code: 200, message: "更新品牌成功" };
        });
    }
    deleteBrand(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            yield this.brandService.deleteBrand(id);
            return { code: 200, message: "删除品牌成功" };
        });
    }
};
__decorate([
    graphql_1.Query("brands"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrandResolver.prototype, "brands", null);
__decorate([
    graphql_1.Mutation("createBrand"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BrandResolver.prototype, "createBrand", null);
__decorate([
    graphql_1.Mutation("updateBrand"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BrandResolver.prototype, "updateBrand", null);
__decorate([
    graphql_1.Mutation("deleteBrand"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BrandResolver.prototype, "deleteBrand", null);
BrandResolver = __decorate([
    graphql_1.Resolver("Brand"),
    common_1.UseInterceptors(exception_interceptor_1.ExceptionInterceptor),
    __param(0, common_1.Inject(brand_service_1.BrandService)),
    __metadata("design:paramtypes", [brand_service_1.BrandService])
], BrandResolver);
exports.BrandResolver = BrandResolver;

//# sourceMappingURL=brand.resolver.js.map
