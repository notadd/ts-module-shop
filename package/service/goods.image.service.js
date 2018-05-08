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
const common_1 = require("@nestjs/common");
const goods_image_entity_1 = require("../model/goods.image.entity");
const typeorm_1 = require("@nestjs/typeorm");
const goods_entity_1 = require("../model/goods.entity");
const typeorm_2 = require("typeorm");
let GoodsImageService = class GoodsImageService {
    constructor(storeComponent, goodsRepository, goodsImageRepository) {
        this.storeComponent = storeComponent;
        this.goodsRepository = goodsRepository;
        this.goodsImageRepository = goodsImageRepository;
    }
    getGoodsImages(req, goodsId) {
        return __awaiter(this, void 0, void 0, function* () {
            const goods = yield this.goodsRepository.findOneById(goodsId, { relations: ["images"] });
            if (!goods) {
                throw new common_1.HttpException("指定id=" + goodsId + "商品不存在", 404);
            }
            const images = goods.images;
            for (let i = 0; i < images.length; i++) {
                images[i].url = yield this.storeComponent.getUrl(req, images[i].bucketName, images[i].name, images[i].type, undefined);
            }
            return images;
        });
    }
    createGoodsImage(goodsId, bucketName, rawName, base64) {
        return __awaiter(this, void 0, void 0, function* () {
            const goods = yield this.goodsRepository.findOneById(goodsId);
            if (!goods) {
                throw new common_1.HttpException("指定id=" + goodsId + "商品不存在", 404);
            }
            const { name, type } = yield this.storeComponent.upload(bucketName, rawName, base64, undefined);
            try {
                yield this.goodsImageRepository.save({ bucketName, name, type, goods });
            }
            catch (err) {
                yield this.storeComponent.delete(bucketName, name, type);
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    deleteGoodsImage(goodsId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const goods = yield this.goodsRepository.findOneById(goodsId, { relations: ["images"] });
            if (!goods) {
                throw new common_1.HttpException("指定id=" + goodsId + "商品不存在", 404);
            }
            const image = goods.images.find(img => img.id === id);
            if (!image) {
                throw new common_1.HttpException("指定id=" + id + "图片不存在于指定id=" + goodsId + "商品之下", 404);
            }
            try {
                yield this.storeComponent.delete(image.bucketName, image.name, image.type);
                yield this.goodsImageRepository.remove(image);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
};
GoodsImageService = __decorate([
    common_1.Component(),
    __param(0, common_1.Inject("StoreComponentToken")),
    __param(1, typeorm_1.InjectRepository(goods_entity_1.Goods)),
    __param(2, typeorm_1.InjectRepository(goods_image_entity_1.GoodsImage)),
    __metadata("design:paramtypes", [Object, typeorm_2.Repository,
        typeorm_2.Repository])
], GoodsImageService);
exports.GoodsImageService = GoodsImageService;
