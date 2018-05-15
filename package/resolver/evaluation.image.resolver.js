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
const evaluation_image_service_1 = require("../service/evaluation.image.service");
const exception_interceptor_1 = require("../interceptor/exception.interceptor");
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
let EvaluationImageResolver = class EvaluationImageResolver {
    constructor(evaluationImageService) {
        this.evaluationImageService = evaluationImageService;
    }
    evaluationImages(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { evaluationId } = body;
            if (!evaluationId) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            const images = yield this.evaluationImageService.getEvaluationImages(req, evaluationId);
            return { code: 200, message: "获取指定评价的图片成功", images };
        });
    }
    createEvaluationImage(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { evaluationId, bucketName, rawName, base64 } = body;
            if (!evaluationId || !bucketName || !rawName || !base64) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.evaluationImageService.createEvaluationImage(evaluationId, bucketName, rawName, base64);
            return { code: 200, message: "创建评价图片成功" };
        });
    }
    deleteEvaluationImage(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.evaluationImageService.deleteEvaluationImage(id);
            return { code: 200, message: "删除评价图片成功" };
        });
    }
};
__decorate([
    graphql_1.Query("evaluationImages"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EvaluationImageResolver.prototype, "evaluationImages", null);
__decorate([
    graphql_1.Mutation("createEvaluationImage"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EvaluationImageResolver.prototype, "createEvaluationImage", null);
__decorate([
    graphql_1.Mutation("deleteEvaluationImage"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EvaluationImageResolver.prototype, "deleteEvaluationImage", null);
EvaluationImageResolver = __decorate([
    graphql_1.Resolver("EvaluationImage"),
    common_1.UseInterceptors(exception_interceptor_1.ExceptionInterceptor),
    __param(0, common_1.Inject(evaluation_image_service_1.EvaluationImageService)),
    __metadata("design:paramtypes", [evaluation_image_service_1.EvaluationImageService])
], EvaluationImageResolver);
exports.EvaluationImageResolver = EvaluationImageResolver;

//# sourceMappingURL=evaluation.image.resolver.js.map
