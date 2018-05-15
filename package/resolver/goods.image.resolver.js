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
const goods_image_service_1 = require("../service/goods.image.service");
const graphql_1 = require("@nestjs/graphql");
let GoodsImageResolver = class GoodsImageResolver {
    constructor(goodsImageService) {
        this.goodsImageService = goodsImageService;
    }
    goodsImages(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { goodsId } = body;
            if (!goodsId) {
                throw new common_1.HttpException("指定id=" + goodsId + "商品不存在", 404);
            }
            const images = yield this.goodsImageService.getGoodsImages(req, goodsId);
            return { code: 200, message: "获取指定商品的所有图片成功", images };
        });
    }
    createGoodsImage(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { goodsId, bucketName, rawName, base64 } = body;
            if (!goodsId || !bucketName || !rawName || !base64) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            yield this.goodsImageService.createGoodsImage(goodsId, bucketName, rawName, base64);
            return { code: 200, message: "创建商品图片成功" };
        });
    }
    deleteGoodsImage(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { goodsId, id } = body;
            if (!goodsId || !id) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            yield this.goodsImageService.deleteGoodsImage(goodsId, id);
            return { code: 200, message: "删除商品图片成功" };
        });
    }
};
__decorate([
    graphql_1.Query("goodsImages"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GoodsImageResolver.prototype, "goodsImages", null);
__decorate([
    graphql_1.Mutation("createGoodsImage"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GoodsImageResolver.prototype, "createGoodsImage", null);
__decorate([
    graphql_1.Mutation("deleteGoodsImage"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GoodsImageResolver.prototype, "deleteGoodsImage", null);
GoodsImageResolver = __decorate([
    graphql_1.Resolver("GoodsImage"),
    common_1.UseInterceptors(exception_interceptor_1.ExceptionInterceptor),
    __param(0, common_1.Inject(goods_image_service_1.GoodsImageService)),
    __metadata("design:paramtypes", [goods_image_service_1.GoodsImageService])
], GoodsImageResolver);
exports.GoodsImageResolver = GoodsImageResolver;

//# sourceMappingURL=goods.image.resolver.js.map
