"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_utils_1 = require("@nestjs/typeorm/typeorm.utils");
const second_classify_entity_1 = require("../model/second.classify.entity");
const third_classify_entity_1 = require("../model/third.classify.entity");
const first_classify_entity_1 = require("../model/first.classify.entity");
const common_1 = require("@nestjs/common");
const goods_entity_1 = require("../model/goods.entity");
class ShopComponent {
    constructor(goodsRepository, firstClassifyRepository, secondClassifyRepository, thirdClassifyRepository) {
        this.goodsRepository = goodsRepository;
        this.firstClassifyRepository = firstClassifyRepository;
        this.secondClassifyRepository = secondClassifyRepository;
        this.thirdClassifyRepository = thirdClassifyRepository;
    }
    getSubClassifyIds(id, level) {
        return __awaiter(this, void 0, void 0, function* () {
            if (level === 1) {
                const firstClassify = yield this.firstClassifyRepository.createQueryBuilder("first")
                    .leftJoinAndSelect("first.children", "second")
                    .select(["second.id"])
                    .getOne();
                return firstClassify.children.map(second => second.id);
            }
            else if (level === 2) {
                const secondClassify = yield this.secondClassifyRepository.createQueryBuilder("second")
                    .leftJoinAndSelect("second.children", "third")
                    .select(["third.id"])
                    .getOne();
                return secondClassify.children.map(third => third.id);
            }
            else {
                return undefined;
            }
        });
    }
    getGoodsById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const goods = yield this.goodsRepository.createQueryBuilder("goods")
                .select(["goods.id", "goods.name", "goods.no", "goods.basePrice", "goods.discountPrice"])
                .where({ id, recycle: false })
                .leftJoinAndSelect("goods.classify", "classify")
                .leftJoinAndSelect("goods.images", "image")
                .getOne();
            return goods;
        });
    }
    getGoodsesByIds(ids, pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            let queryBuilder = this.goodsRepository.createQueryBuilder("goods")
                .select(["goods.id", "goods.name", "goods.no", "goods.basePrice", "goods.discountPrice"])
                .whereInIds(ids)
                .leftJoinAndSelect("goods.classify", "classify")
                .leftJoinAndSelect("goods.images", "image");
            if (pageNumber && pageSize) {
                if (!Number.isInteger(pageNumber) || !Number.isInteger(pageSize)) {
                    throw new common_1.HttpException("分页参数错误，应为整数", 404);
                }
                queryBuilder = queryBuilder.offset((pageNumber - 1) * pageSize).limit(pageSize);
            }
            const goodses = yield queryBuilder.getMany();
            return goodses;
        });
    }
    getTotal(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const total = yield this.goodsRepository.createQueryBuilder("goods").whereInIds(ids).getCount();
            return total;
        });
    }
    findNoExist(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const goodses = yield this.goodsRepository.findByIds(ids);
            for (let i = 0; i < ids.length; i++) {
                const exist = goodses.find(goods => goods.id === ids[i]);
                if (!exist) {
                    return { exist: false, id: ids[i] };
                }
            }
            return { exist: true, id: undefined };
        });
    }
}
exports.ShopComponent = ShopComponent;
exports.ShopComponentToken = "ShopComponentToken";
exports.ShopComponentProvider = {
    provide: exports.ShopComponentToken,
    useFactory: (goodsRepository, firstClassifyRepository, secondClassifyRepository, thirdClassifyRepository) => {
        return new ShopComponent(goodsRepository, firstClassifyRepository, secondClassifyRepository, thirdClassifyRepository);
    },
    inject: [typeorm_utils_1.getRepositoryToken(goods_entity_1.Goods), typeorm_utils_1.getRepositoryToken(first_classify_entity_1.FirstClassify), typeorm_utils_1.getRepositoryToken(second_classify_entity_1.SecondClassify), typeorm_utils_1.getRepositoryToken(third_classify_entity_1.ThirdClassify)]
};
