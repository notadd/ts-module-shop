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
const goods_property_service_1 = require("../service/goods.property.service");
const graphql_1 = require("@nestjs/graphql");
let GoodsPropertyResolver = class GoodsPropertyResolver {
    constructor(goodsPropertyService) {
        this.goodsPropertyService = goodsPropertyService;
    }
    createGoodsProperty(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { goodsTypeId, name, type, inputType, list } = body;
            if (!goodsTypeId || !name || !type || !inputType) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            if (type !== "unique" && type !== "radio" && type !== "check") {
                throw new common_1.HttpException("type参数不正确", 404);
            }
            if (inputType !== "text" && inputType !== "list" && inputType !== "textarea") {
                throw new common_1.HttpException("inputType参数不正确", 404);
            }
            if (inputType === "list" && !list) {
                throw new common_1.HttpException("输入类型为list时，list列表值必须存在", 404);
            }
            yield this.goodsPropertyService.createGoodsProperty(goodsTypeId, name, type, inputType, list);
            return { code: 200, message: "创建商品属性成功" };
        });
    }
    updateGoodsProperty(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, type, inputType, list } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            if (inputType === "list" && !list) {
                throw new common_1.HttpException("输入类型为list时，list列表值必须存在", 404);
            }
            yield this.goodsPropertyService.updateGoodsProperty(id, name, type, inputType, list);
            return { code: 200, message: "更新商品属性成功" };
        });
    }
    deleteGoodsProperty(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            yield this.goodsPropertyService.deleteGoodsProperty(id);
            return { code: 200, message: "删除商品属性成功" };
        });
    }
};
__decorate([
    graphql_1.Mutation("createGoodsProperty"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GoodsPropertyResolver.prototype, "createGoodsProperty", null);
__decorate([
    graphql_1.Mutation("updateGoodsProperty"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GoodsPropertyResolver.prototype, "updateGoodsProperty", null);
__decorate([
    graphql_1.Mutation("deleteGoodsProperty"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GoodsPropertyResolver.prototype, "deleteGoodsProperty", null);
GoodsPropertyResolver = __decorate([
    graphql_1.Resolver("GoodsProperty"),
    common_1.UseInterceptors(exception_interceptor_1.ExceptionInterceptor),
    __param(0, common_1.Inject(goods_property_service_1.GoodsPropertyService)),
    __metadata("design:paramtypes", [goods_property_service_1.GoodsPropertyService])
], GoodsPropertyResolver);
exports.GoodsPropertyResolver = GoodsPropertyResolver;

//# sourceMappingURL=goods.property.resolver.js.map
