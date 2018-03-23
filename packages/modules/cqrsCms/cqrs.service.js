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
const cqrs_1 = require("@nestjs/cqrs");
const create_param_command_1 = require("./commands/impl/create-param.command");
const delete_param_command_1 = require("./commands/impl/delete-param.command");
const page_param_command_1 = require("./commands/impl/page-param.command");
const get_page_param_command_1 = require("./commands/impl/get-page-param.command");
const classify_param_command_1 = require("./commands/impl/classify-param.command");
const article_param_command_1 = require("./commands/impl/article-param.command");
const get_classify_param_command_1 = require("./commands/impl/get-classify-param.command");
let CqrsService = class CqrsService {
    constructor(commonbus) {
        this.commonbus = commonbus;
    }
    createXml(createxmlDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commonbus.execute(new create_param_command_1.CreateParamCommand(createxmlDto));
            return result;
        });
    }
    updateXml() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commonbus.execute(new delete_param_command_1.DeleteParamCommand('10000', '10000'));
            return result;
        });
    }
    pageCurd(updateDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commonbus.execute(new page_param_command_1.PageParamCommand(updateDto));
            return result;
        });
    }
    getPages(getPageDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commonbus.execute(new get_page_param_command_1.GetPageParamCommand(getPageDto));
            return result;
        });
    }
    classifyCurd(getClassifyDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commonbus.execute(new classify_param_command_1.ClassifyParamCommand(getClassifyDto));
            return result;
        });
    }
    getClassify(getClassifyDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commonbus.execute(new get_classify_param_command_1.GetClassifyParamCommand(getClassifyDto));
            return result;
        });
    }
    articleCurd(getArticleDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commonbus.execute(new article_param_command_1.ArticleParamCommand(getArticleDto));
            return result;
        });
    }
};
CqrsService = __decorate([
    common_1.Component(),
    __metadata("design:paramtypes", [cqrs_1.CommandBus])
], CqrsService);
exports.CqrsService = CqrsService;
