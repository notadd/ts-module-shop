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
const page_param_command_1 = require("../impl/page-param.command");
const page_service_1 = require("../../service/page.service");
const clc = require('cli-color');
let CreatePageHandler = class CreatePageHandler {
    constructor(repositoty, publisher, pageService) {
        this.repositoty = repositoty;
        this.publisher = publisher;
        this.pageService = pageService;
    }
    execute(command, resolver) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(clc.greenBright('handlerCommand  PageFindByIdCommand...'));
            let id = '0';
            let result;
            const page = this.publisher.mergeObjectContext(yield this.repositoty.find(id));
            if (!command.pageEntity.array) {
                result = yield this.pageService.curdCheck(command.pageEntity.page.alias, command.pageEntity.page.classifyId);
                if (result.Continue) {
                    page.createPage(command.pageEntity);
                }
            }
            else {
                page.createPage(command.pageEntity);
            }
            page.commit();
            resolver(result);
        });
    }
};
CreatePageHandler = __decorate([
    cqrs_1.CommandHandler(page_param_command_1.PageParamCommand),
    __metadata("design:paramtypes", [pageRepository_1.PageRepository,
        cqrs_1.EventPublisher,
        page_service_1.PageService])
], CreatePageHandler);
exports.CreatePageHandler = CreatePageHandler;
