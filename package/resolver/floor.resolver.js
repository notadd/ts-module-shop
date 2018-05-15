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
const floor_service_1 = require("../service/floor.service");
let FloorResolver = class FloorResolver {
    constructor(floorService) {
        this.floorService = floorService;
    }
    floors(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const floors = yield this.floorService.getFloors();
            return { code: 200, message: "获取所有楼层成功", floors };
        });
    }
    floor(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            const floor = yield this.floorService.getFloor(id);
            return { code: 200, message: "获取指定楼层成功", floor };
        });
    }
    createFloor(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, display, goodsIds } = body;
            if (!name || display === undefined || display === null || !goodsIds || goodsIds.length === 0) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            if (display !== true && display !== false) {
                throw new common_1.HttpException("参数错误", 400);
            }
            yield this.floorService.createFloor(name, display, goodsIds);
            return { code: 200, message: "创建楼层成功" };
        });
    }
    updateFloor(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, display, goodsIds } = body;
            if (!id || !name || display === undefined || display === null || !goodsIds || goodsIds.length === 0) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            if (display !== true && display !== false) {
                throw new common_1.HttpException("参数错误", 400);
            }
            yield this.floorService.updateFloor(id, name, display, goodsIds);
            return { code: 200, message: "更新楼层成功" };
        });
    }
    deleteFloor(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            yield this.floorService.deleteFloor(id);
            return { code: 200, message: "删除楼层成功" };
        });
    }
};
__decorate([
    graphql_1.Query("floors"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FloorResolver.prototype, "floors", null);
__decorate([
    graphql_1.Query("floor"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FloorResolver.prototype, "floor", null);
__decorate([
    graphql_1.Mutation("createFloor"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FloorResolver.prototype, "createFloor", null);
__decorate([
    graphql_1.Mutation("updateFloor"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FloorResolver.prototype, "updateFloor", null);
__decorate([
    graphql_1.Mutation("deleteFloor"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FloorResolver.prototype, "deleteFloor", null);
FloorResolver = __decorate([
    graphql_1.Resolver("Floor"),
    common_1.UseInterceptors(exception_interceptor_1.ExceptionInterceptor),
    __param(0, common_1.Inject(floor_service_1.FloorService)),
    __metadata("design:paramtypes", [floor_service_1.FloorService])
], FloorResolver);
exports.FloorResolver = FloorResolver;

//# sourceMappingURL=floor.resolver.js.map
