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
const typeorm_1 = require("@nestjs/typeorm");
const floor_entity_1 = require("../model/floor.entity");
const goods_entity_1 = require("../model/goods.entity");
const typeorm_2 = require("typeorm");
let FloorService = class FloorService {
    constructor(goodsRepository, floorRepository) {
        this.goodsRepository = goodsRepository;
        this.floorRepository = floorRepository;
    }
    getFloors() {
        return __awaiter(this, void 0, void 0, function* () {
            const floors = yield this.floorRepository.find();
            return floors;
        });
    }
    getFloor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const floor = yield this.floorRepository.createQueryBuilder("floor")
                .leftJoinAndSelect("floor.goodses", "goods")
                .where({ id })
                .getOne();
            return floor;
        });
    }
    createFloor(name, display, goodsIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const exist = yield this.floorRepository.findOne({ name });
            if (exist) {
                throw new common_1.HttpException("指定name=" + name + "楼层已存在", 404);
            }
            const goodses = yield this.goodsRepository.findByIds(goodsIds);
            for (let i = 0; i < goodsIds.length; i++) {
                const find = goodses.find(goods => goods.id === goodsIds[i]);
                if (!find) {
                    throw new common_1.HttpException("指定id=" + goodsIds[i] + "商品未找到", 404);
                }
            }
            try {
                yield this.floorRepository.save({ name, display: !!display, goodses });
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    updateFloor(id, name, display, goodsIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const floor = yield this.floorRepository.findOneById(id);
            if (!floor) {
                throw new common_1.HttpException("指定id=" + id + "楼层不存在", 404);
            }
            if (floor.name !== name) {
                const exist = yield this.floorRepository.findOne({ name });
                if (exist) {
                    throw new common_1.HttpException("指定name=" + name + "楼层已存在", 404);
                }
                floor.name = name;
            }
            floor.display = !!display;
            const goodses = yield this.goodsRepository.findByIds(goodsIds);
            for (let i = 0; i < goodsIds.length; i++) {
                const find = goodses.find(goods => goods.id === goodsIds[i]);
                if (!find) {
                    throw new common_1.HttpException("指定id=" + goodsIds[i] + "商品未找到", 404);
                }
            }
            floor.goodses = goodses;
            try {
                yield this.floorRepository.save(floor);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
    deleteFloor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const floor = yield this.floorRepository.findOneById(id);
            if (!floor) {
                throw new common_1.HttpException("指定id=" + id + "楼层不存在", 404);
            }
            try {
                yield this.floorRepository.remove(floor);
            }
            catch (err) {
                throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
            }
        });
    }
};
FloorService = __decorate([
    common_1.Component(),
    __param(0, typeorm_1.InjectRepository(goods_entity_1.Goods)),
    __param(1, typeorm_1.InjectRepository(floor_entity_1.Floor)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], FloorService);
exports.FloorService = FloorService;
