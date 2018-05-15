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
const property_value_service_1 = require("../service/property.value.service");
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
let PropertyValueResolver = class PropertyValueResolver {
    constructor(propertyValueService) {
        this.propertyValueService = propertyValueService;
    }
    propertyValues(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { goodsId } = body;
            if (!goodsId) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            const values = yield this.propertyValueService.getPropertyValues(goodsId);
            return { code: 200, message: "获取指定商品的所有属性值成功", values };
        });
    }
    createPropertyValue(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { goodsId, goodsPropertyId, value, price } = body;
            if (!goodsId || !goodsPropertyId || !value) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            yield this.propertyValueService.createPropertyValue(goodsId, goodsPropertyId, value, price);
            return { code: 200, message: "创建属性值成功" };
        });
    }
    updatePropertyValue(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, value, price } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            yield this.propertyValueService.updatePropertyValue(id, value, price);
            return { code: 200, message: "更新属性值成功" };
        });
    }
    deletePropertyValue(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            yield this.propertyValueService.deletePropertyValue(id);
            return { code: 200, message: "删除属性值成功" };
        });
    }
};
__decorate([
    graphql_1.Query("propertyValues"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PropertyValueResolver.prototype, "propertyValues", null);
__decorate([
    graphql_1.Mutation("createPropertyValue"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PropertyValueResolver.prototype, "createPropertyValue", null);
__decorate([
    graphql_1.Mutation("updatePropertyValue"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PropertyValueResolver.prototype, "updatePropertyValue", null);
__decorate([
    graphql_1.Mutation("deletePropertyValue"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PropertyValueResolver.prototype, "deletePropertyValue", null);
PropertyValueResolver = __decorate([
    graphql_1.Resolver("PropertyValue"),
    __param(0, common_1.Inject(property_value_service_1.PropertyValueService)),
    __metadata("design:paramtypes", [property_value_service_1.PropertyValueService])
], PropertyValueResolver);
exports.PropertyValueResolver = PropertyValueResolver;

//# sourceMappingURL=property.value.resolver.js.map
