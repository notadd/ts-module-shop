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
const classify_service_1 = require("../service/classify.service");
const graphql_1 = require("@nestjs/graphql");
let ClassifyResolver = class ClassifyResolver {
    constructor(classifyService) {
        this.classifyService = classifyService;
    }
    classifies(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { parentId, level } = body;
            if (level !== 1 && level !== 2 && level !== 3) {
                throw new common_1.HttpException("参数错误", 400);
            }
            const classifies = yield this.classifyService.getClassifes(parentId, level);
            return { code: 200, message: "获取指定分类成功", classifies };
        });
    }
    classify(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, level } = body;
            if (!id || !level) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            if (level !== 1 && level !== 2 && level !== 3) {
                throw new common_1.HttpException("参数错误", 400);
            }
            const classify = yield this.classifyService.getClassify(id, level);
            return { code: 200, message: "获取指定分类成功", classify };
        });
    }
    createClassify(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, level, parentId } = body;
            if (!name || !description || !level) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            if (level !== 1 && level !== 2 && level !== 3) {
                throw new common_1.HttpException("参数错误", 400);
            }
            if (level !== 1 && !parentId) {
                throw new common_1.HttpException("缺少上级分类", 400);
            }
            yield this.classifyService.createClassify(name, description, level, parentId);
            return { code: 200, message: "创建分类成功" };
        });
    }
    updateClassify(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, description, level } = body;
            if (!id || !name || !description || !level) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            if (level !== 1 && level !== 2 && level !== 3) {
                throw new common_1.HttpException("参数错误", 400);
            }
            yield this.classifyService.updateClassify(id, name, description, level);
            return { code: 200, message: "更新分类成功" };
        });
    }
    deleteClassify(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, level } = body;
            if (!id || !level) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            if (level !== 1 && level !== 2 && level !== 3) {
                throw new common_1.HttpException("参数错误", 400);
            }
            yield this.classifyService.deleteClassify(id, level);
            return { code: 200, message: "删除分类成功" };
        });
    }
};
__decorate([
    graphql_1.Query("classifies"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ClassifyResolver.prototype, "classifies", null);
__decorate([
    graphql_1.Query("classify"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ClassifyResolver.prototype, "classify", null);
__decorate([
    graphql_1.Mutation("createClassify"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ClassifyResolver.prototype, "createClassify", null);
__decorate([
    graphql_1.Mutation("updateClassify"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ClassifyResolver.prototype, "updateClassify", null);
__decorate([
    graphql_1.Mutation("deleteClassify"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ClassifyResolver.prototype, "deleteClassify", null);
ClassifyResolver = __decorate([
    graphql_1.Resolver("Classify"),
    common_1.UseInterceptors(exception_interceptor_1.ExceptionInterceptor),
    __param(0, common_1.Inject(classify_service_1.ClassifyService)),
    __metadata("design:paramtypes", [classify_service_1.ClassifyService])
], ClassifyResolver);
exports.ClassifyResolver = ClassifyResolver;

//# sourceMappingURL=classify.resolver.js.map
