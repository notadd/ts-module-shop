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
const cqrs_1 = require("@nestjs/cqrs");
const pageRepository_1 = require("../../repository/pageRepository");
const classify_param_command_1 = require("../impl/classify-param.command");
const classify_service_1 = require("../../service/classify.service");
const clc = require('cli-color');
let ClassifyCurdHandler = class ClassifyCurdHandler {
    constructor(repositoty, publisher, classifyService) {
        this.repositoty = repositoty;
        this.publisher = publisher;
        this.classifyService = classifyService;
    }
    execute(command, resolver) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(clc.greenBright('handlerCommand classify_curd Command...'));
            let id = '0';
            const page = this.publisher.mergeObjectContext(yield this.repositoty.find(id));
            let value, MessageCodeError;
            if (!command.classify.getAllClassify) {
                if (command.classify.createClassify) {
                    if (command.classify.createClassify.art) {
                        const result = yield this.classifyService.classifyCheck(command.classify.useFor, command.classify.createClassify.art.id, command.classify.createClassify.art.groupId, command.classify.createClassify.art.classifyAlias);
                        value = result.Continue;
                        MessageCodeError = result.MessageCodeError;
                    }
                    if (command.classify.createClassify.page) {
                        const result = yield this.classifyService.classifyCheck(command.classify.useFor, command.classify.createClassify.page.id, command.classify.createClassify.page.groupId, command.classify.createClassify.page.classifyAlias);
                        value = result.Continue;
                        MessageCodeError = result.MessageCodeError;
                    }
                }
                if (command.classify.updateClassify) {
                    if (command.classify.updateClassify.page) {
                        const result = yield this.classifyService.classifyCheck(command.classify.useFor, command.classify.updateClassify.page.id, command.classify.updateClassify.page.groupId, command.classify.updateClassify.page.classifyAlias);
                        value = result.Continue;
                        MessageCodeError = result.MessageCodeError;
                    }
                    if (command.classify.updateClassify.art) {
                        const result = yield this.classifyService.classifyCheck(command.classify.useFor, command.classify.updateClassify.art.id, command.classify.updateClassify.art.groupId, command.classify.updateClassify.art.classifyAlias);
                        value = result.Continue;
                        MessageCodeError = result.MessageCodeError;
                    }
                }
                if (command.classify.mobileClassifyId) {
                    const result = yield this.classifyService.classifyCheck(command.classify.useFor, command.classify.mobileClassifyId.id, command.classify.mobileClassifyId.parentId);
                    value = result.Continue;
                    MessageCodeError = result.MessageCodeError;
                }
                if (command.classify.deleteClassify) {
                    const result = yield this.classifyService.classifyCheck(command.classify.useFor, 0, 0, '', command.classify.deleteClassify);
                    value = result.Continue;
                    MessageCodeError = result.MessageCodeError;
                }
                if (value == undefined)
                    value = true;
                if (value)
                    page.createClassify(command.classify);
            }
            page.commit();
            resolver({ MessageCodeError: MessageCodeError, Continue: value });
        });
    }
};
ClassifyCurdHandler = __decorate([
    cqrs_1.CommandHandler(classify_param_command_1.ClassifyParamCommand),
    __metadata("design:paramtypes", [pageRepository_1.PageRepository,
        cqrs_1.EventPublisher,
        classify_service_1.ClassifyService])
], ClassifyCurdHandler);
exports.ClassifyCurdHandler = ClassifyCurdHandler;
