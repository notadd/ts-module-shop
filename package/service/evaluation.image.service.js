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
const evaluation_image_entity_1 = require("../model/evaluation.image.entity");
const common_1 = require("@nestjs/common");
const evaluation_entity_1 = require("../model/evaluation.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let EvaluationImageService = class EvaluationImageService {
    constructor(storeComponent, evaluationRepository, evaluationImageRepository) {
        this.storeComponent = storeComponent;
        this.evaluationRepository = evaluationRepository;
        this.evaluationImageRepository = evaluationImageRepository;
    }
    getEvaluationImages(req, evaluationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const evaluation = yield this.evaluationRepository.findOne(evaluationId, { relations: ["images"] });
            if (!evaluation) {
                throw new common_1.HttpException("指定id=" + evaluationId + "评价不存在", 404);
            }
            const images = evaluation.images;
            for (let i = 0; i < images.length; i++) {
                images[i].url = yield this.storeComponent.getUrl(req, images[i].bucketName, images[i].name, images[i].type, undefined);
            }
            console.log(images);
            return images;
        });
    }
    createEvaluationImage(evaluationId, bucketName, rawName, base64) {
        return __awaiter(this, void 0, void 0, function* () {
            const evaluation = yield this.evaluationRepository.findOne(evaluationId, { relations: ["images"] });
            if (!evaluation) {
                throw new common_1.HttpException("指定id=" + evaluationId + "评价不存在0", 404);
            }
            const { name, type } = yield this.storeComponent.upload(bucketName, rawName, base64, undefined);
            try {
                evaluation.images.push(this.evaluationImageRepository.create({ bucketName, name, type }));
                yield this.evaluationRepository.save(evaluation);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    deleteEvaluationImage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const evaluationImage = yield this.evaluationImageRepository.findOne(id);
            if (!evaluationImage) {
                throw new common_1.HttpException("指定id=" + id + "评价图片不存在", 404);
            }
            yield this.storeComponent.delete(evaluationImage.bucketName, evaluationImage.name, evaluationImage.type);
            try {
                yield this.evaluationImageRepository.remove(evaluationImage);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
};
EvaluationImageService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject("StoreComponentToken")),
    __param(1, typeorm_1.InjectRepository(evaluation_entity_1.Evaluation)),
    __param(2, typeorm_1.InjectRepository(evaluation_image_entity_1.EvaluationImage)),
    __metadata("design:paramtypes", [Object, typeorm_2.Repository,
        typeorm_2.Repository])
], EvaluationImageService);
exports.EvaluationImageService = EvaluationImageService;

//# sourceMappingURL=evaluation.image.service.js.map
