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
const second_classify_entity_1 = require("../model/second.classify.entity");
const first_classify_entity_1 = require("../model/first.classify.entity");
const third_classify_entity_1 = require("../model/third.classify.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let ClassifyService = class ClassifyService {
    constructor(firstClassifyRepository, secondClassifyRepository, thirdClassifyRepository) {
        this.firstClassifyRepository = firstClassifyRepository;
        this.secondClassifyRepository = secondClassifyRepository;
        this.thirdClassifyRepository = thirdClassifyRepository;
    }
    getClassifes(parentId, level) {
        return __awaiter(this, void 0, void 0, function* () {
            if (level === 1) {
                return this.firstClassifyRepository.find();
            }
            else if (level === 2) {
                let parent;
                if (parentId) {
                    parent = yield this.firstClassifyRepository.findOneById(parentId);
                    if (!parent) {
                        throw new common_1.HttpException("指定id=" + parentId + "上级分类不存在", 404);
                    }
                    return this.secondClassifyRepository.find({ parent });
                }
                else {
                    return this.secondClassifyRepository.find();
                }
            }
            else {
                let parent;
                if (parentId) {
                    parent = yield this.secondClassifyRepository.findOneById(parentId);
                    if (!parent) {
                        throw new common_1.HttpException("指定id=" + parentId + "上级分类不存在", 404);
                    }
                    return this.thirdClassifyRepository.find({ parent });
                }
                else {
                    return this.thirdClassifyRepository.find();
                }
            }
        });
    }
    getClassify(id, level) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            if (level === 1) {
                result = yield this.firstClassifyRepository.findOneById(id);
            }
            else if (level === 2) {
                result = yield this.secondClassifyRepository.findOneById(id);
            }
            else {
                result = yield this.thirdClassifyRepository.findOneById(id);
            }
            return result;
        });
    }
    createClassify(name, description, level, parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (level === 1) {
                const exist = yield this.firstClassifyRepository.findOne({ name });
                if (exist) {
                    throw new common_1.HttpException("指定name=" + name + "一级分类已存在", 404);
                }
                try {
                    yield this.firstClassifyRepository.save({ name, description });
                }
                catch (err) {
                    throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
                }
            }
            else if (level === 2) {
                const exist = yield this.secondClassifyRepository.findOne({ name });
                if (exist) {
                    throw new common_1.HttpException("指定name=" + name + "二级分类已存在", 404);
                }
                const parent = yield this.firstClassifyRepository.findOneById(parentId);
                if (!parent) {
                    throw new common_1.HttpException("指定id=" + parentId + "上级分类不存在", 404);
                }
                try {
                    yield this.secondClassifyRepository.save({ name, description, parent });
                }
                catch (err) {
                    throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
                }
            }
            else {
                const exist = yield this.thirdClassifyRepository.findOne({ name });
                if (exist) {
                    throw new common_1.HttpException("指定name=" + name + "三级分类已存在", 404);
                }
                const parent = yield this.secondClassifyRepository.findOneById(parentId);
                if (!parent) {
                    throw new common_1.HttpException("指定id=" + parentId + "上级分类不存在", 404);
                }
                try {
                    yield this.thirdClassifyRepository.save({ name, description, parent });
                }
                catch (err) {
                    throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
                }
            }
        });
    }
    updateClassify(id, name, description, level) {
        return __awaiter(this, void 0, void 0, function* () {
            if (level === 1) {
                const classify = yield this.firstClassifyRepository.findOneById(id);
                if (!classify) {
                    throw new common_1.HttpException("指定id=" + id + "一级分类不存在", 404);
                }
                classify.name = name;
                classify.description = description;
                try {
                    yield this.firstClassifyRepository.save(classify);
                }
                catch (err) {
                    throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
                }
            }
            else if (level === 2) {
                const classify = yield this.secondClassifyRepository.findOneById(id);
                if (!classify) {
                    throw new common_1.HttpException("指定id=" + id + "二级分类不存在", 404);
                }
                classify.name = name;
                classify.description = description;
                try {
                    yield this.secondClassifyRepository.save(classify);
                }
                catch (err) {
                    throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
                }
            }
            else {
                const classify = yield this.thirdClassifyRepository.findOneById(id);
                if (!classify) {
                    throw new common_1.HttpException("指定id=" + id + "三级分类不存在", 404);
                }
                classify.name = name;
                classify.description = description;
                try {
                    yield this.thirdClassifyRepository.save(classify);
                }
                catch (err) {
                    throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
                }
            }
        });
    }
    deleteClassify(id, level) {
        return __awaiter(this, void 0, void 0, function* () {
            if (level === 1) {
                const classify = yield this.firstClassifyRepository.findOneById(id, { relations: ["children"] });
                if (!classify) {
                    throw new common_1.HttpException("指定id=" + id + "一级分类不存在", 404);
                }
                if (classify.children && classify.children.length > 0) {
                    throw new common_1.HttpException("指定id=" + id + "一级分类下存在二级分类，不能删除", 404);
                }
                try {
                    yield this.firstClassifyRepository.remove(classify);
                }
                catch (err) {
                    throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
                }
            }
            else if (level === 2) {
                const classify = yield this.secondClassifyRepository.findOneById(id, { relations: ["children"] });
                if (!classify) {
                    throw new common_1.HttpException("指定id=" + id + "二级分类不存在", 404);
                }
                if (classify.children && classify.children.length > 0) {
                    throw new common_1.HttpException("指定id=" + id + "二级分类下存在三级分类，不能删除", 404);
                }
                try {
                    yield this.secondClassifyRepository.remove(classify);
                }
                catch (err) {
                    throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
                }
            }
            else {
                const classify = yield this.thirdClassifyRepository.findOneById(id, { relations: ["goodses"] });
                if (!classify) {
                    throw new common_1.HttpException("指定id=" + id + "三级分类不存在", 404);
                }
                if (classify.goodses && classify.goodses.length > 0) {
                    throw new common_1.HttpException("指定id=" + id + "三级分类下存在商品，不能删除", 404);
                }
                try {
                    yield this.thirdClassifyRepository.remove(classify);
                }
                catch (err) {
                    throw new common_1.HttpException("发生了数据库错误" + err.toString(), 403);
                }
            }
        });
    }
};
ClassifyService = __decorate([
    common_1.Component(),
    __param(0, typeorm_1.InjectRepository(first_classify_entity_1.FirstClassify)),
    __param(1, typeorm_1.InjectRepository(second_classify_entity_1.SecondClassify)),
    __param(2, typeorm_1.InjectRepository(third_classify_entity_1.ThirdClassify)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ClassifyService);
exports.ClassifyService = ClassifyService;
