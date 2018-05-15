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
const evaluation_service_1 = require("../service/evaluation.service");
const graphql_1 = require("@nestjs/graphql");
let EvaluationResolver = class EvaluationResolver {
    constructor(evaluationService) {
        this.evaluationService = evaluationService;
    }
    evaluation(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            const evaluation = yield this.evaluationService.getEvaluation(id);
            return { code: 200, message: "获取指定评价信息成功", evaluation };
        });
    }
    evaluations(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { goodsId } = body;
            if (!goodsId) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            const evaluations = yield this.evaluationService.getEvaluations(goodsId);
            return { code: 200, message: "获取指定商品评价成功", evaluations };
        });
    }
    createEvaluation(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { content, userId, orderItemId, inputImages } = body;
            if (!content || !userId || !orderItemId) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.evaluationService.createEvaluation(content, userId, orderItemId, inputImages);
            return { code: 200, message: "创建评价成功" };
        });
    }
    updateEvaluation(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, content, display } = body;
            if (!id || !content || display === undefined || display === null) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            if (display !== true && display !== false) {
                throw new common_1.HttpException("参数错误", 404);
            }
            yield this.evaluationService.updateEvaluation(id, content, display);
            return { code: 200, message: "更新评价成功" };
        });
    }
    deleteEvaluation(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 400);
            }
            yield this.evaluationService.deleteEvaluation(id);
            return { code: 200, message: "删除评价成功" };
        });
    }
};
__decorate([
    graphql_1.Query("evaluation"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EvaluationResolver.prototype, "evaluation", null);
__decorate([
    graphql_1.Query("evaluations"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EvaluationResolver.prototype, "evaluations", null);
__decorate([
    graphql_1.Mutation("createEvaluation"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EvaluationResolver.prototype, "createEvaluation", null);
__decorate([
    graphql_1.Mutation("updateEvaluation"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EvaluationResolver.prototype, "updateEvaluation", null);
__decorate([
    graphql_1.Mutation("deleteEvaluation"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EvaluationResolver.prototype, "deleteEvaluation", null);
EvaluationResolver = __decorate([
    graphql_1.Resolver("Evaluation"),
    common_1.UseInterceptors(exception_interceptor_1.ExceptionInterceptor),
    __param(0, common_1.Inject(evaluation_service_1.EvaluationService)),
    __metadata("design:paramtypes", [evaluation_service_1.EvaluationService])
], EvaluationResolver);
exports.EvaluationResolver = EvaluationResolver;

//# sourceMappingURL=evaluation.resolver.js.map
