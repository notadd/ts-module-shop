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
const user_1 = require("@notadd/user");
const evaluation_image_entity_1 = require("../model/evaluation.image.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const evaluation_entity_1 = require("../model/evaluation.entity");
const order_item_entity_1 = require("../model/order.item.entity");
const typeorm_2 = require("@nestjs/typeorm");
const goods_entity_1 = require("../model/goods.entity");
let EvaluationService = class EvaluationService {
    constructor(connection, userComponent, goodsRepository, storeComponent, orderItemRepository, evaluationRepository, evaluationImageRepository) {
        this.connection = connection;
        this.userComponent = userComponent;
        this.goodsRepository = goodsRepository;
        this.storeComponent = storeComponent;
        this.orderItemRepository = orderItemRepository;
        this.evaluationRepository = evaluationRepository;
        this.evaluationImageRepository = evaluationImageRepository;
    }
    getEvaluation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const evaluation = yield this.evaluationRepository.createQueryBuilder("evaluation")
                .leftJoinAndSelect("evaluation.orderItem", "orderItem")
                .where({ id })
                .getOne();
            if (!evaluation) {
                throw new common_1.HttpException("指定id=" + id + "评价不存在", 404);
            }
            return evaluation;
        });
    }
    getEvaluations(goodsId) {
        return __awaiter(this, void 0, void 0, function* () {
            const goods = yield this.goodsRepository.createQueryBuilder("goods")
                .loadRelationIdAndMap("skuIds", "goods.skus")
                .where({ id: goodsId })
                .getOne();
            const orderItems = yield this.orderItemRepository.createQueryBuilder("orderItem")
                .where(`orderItem.skuId in (${goods.skuIds.join(",")})`)
                .innerJoinAndSelect("orderItem.evaluation", "evaluation")
                .getMany();
            const evaluations = orderItems.map(orderItem => {
                orderItem.evaluation.orderItem = orderItem;
                return orderItem.evaluation;
            });
            return evaluations;
        });
    }
    createEvaluation(content, userId, orderItemId, inputImages) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userComponent.getUserById(userId);
            if (!user) {
                throw new common_1.HttpException("指定id=" + userId + "用户不存在", 404);
            }
            const orderItem = yield this.orderItemRepository.findOne(orderItemId);
            if (!orderItem) {
                throw new common_1.HttpException("指定id=" + orderItemId + "订单项不存在", 404);
            }
            if (orderItem.userId !== userId) {
                throw new common_1.HttpException("指定id=" + orderItemId + "订单项不属于当前用户，不能评价", 404);
            }
            if (orderItem.evaluation) {
                throw new common_1.HttpException("指定id=" + orderItemId + "订单项已经评价，不能再次评价", 404);
            }
            const images = new Array();
            for (let i = 0; i < inputImages.length; i++) {
                const { bucketName, name, type } = yield this.storeComponent.upload(inputImages[i].bucketName, inputImages[i].rawName, inputImages[i].base64, undefined);
                images.push(this.evaluationImageRepository.create({ bucketName, name, type }));
            }
            const queryRunner = this.connection.createQueryRunner("master");
            yield queryRunner.startTransaction();
            try {
                const evaluation = yield queryRunner.manager.save(this.evaluationRepository.create({ content, display: true, user, orderItem, images }));
                images.forEach(image => image.evaluation = evaluation);
                yield queryRunner.manager.save(images);
                yield queryRunner.commitTransaction();
            }
            catch (err) {
                yield queryRunner.rollbackTransaction();
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
            finally {
                yield queryRunner.release();
            }
        });
    }
    updateEvaluation(id, content, display) {
        return __awaiter(this, void 0, void 0, function* () {
            const evaluation = yield this.evaluationRepository.findOne(id);
            if (!evaluation) {
                throw new common_1.HttpException("指定id=" + id + "评价不存在", 404);
            }
            try {
                evaluation.content = content;
                evaluation.display = display;
                yield this.evaluationRepository.save(evaluation);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    deleteEvaluation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const evaluation = yield this.evaluationRepository.findOne(id, { relations: ["images"] });
            if (!evaluation) {
                throw new common_1.HttpException("指定id=" + id + "评价不存在", 404);
            }
            for (let i = 0; i < evaluation.images.length; i++) {
                const { bucketName, name, type } = evaluation.images[i];
                yield this.storeComponent.delete(bucketName, name, type);
            }
            try {
                yield this.evaluationRepository.remove(evaluation);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
};
EvaluationService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(typeorm_1.Connection)),
    __param(1, common_1.Inject(user_1.UserComponentToken)),
    __param(2, typeorm_2.InjectRepository(goods_entity_1.Goods)),
    __param(3, common_1.Inject("StoreComponentToken")),
    __param(4, typeorm_2.InjectRepository(order_item_entity_1.OrderItem)),
    __param(5, typeorm_2.InjectRepository(evaluation_entity_1.Evaluation)),
    __param(6, typeorm_2.InjectRepository(evaluation_image_entity_1.EvaluationImage)),
    __metadata("design:paramtypes", [typeorm_1.Connection,
        user_1.UserComponent,
        typeorm_1.Repository, Object, typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], EvaluationService);
exports.EvaluationService = EvaluationService;

//# sourceMappingURL=evaluation.service.js.map
