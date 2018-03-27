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
const create_param_command_1 = require("../impl/create-param.command");
const pageRepository_1 = require("../../repository/pageRepository");
let CreateSitemapHandler = class CreateSitemapHandler {
    constructor(repositoty, publisher) {
        this.repositoty = repositoty;
        this.publisher = publisher;
    }
    execute(command, resolver) {
        return __awaiter(this, void 0, void 0, function* () {
            const sitemap = this.publisher.mergeObjectContext(yield this.repositoty.siteMap());
            sitemap.createxml(command.createXml);
            resolver();
            sitemap.commit();
        });
    }
};
CreateSitemapHandler = __decorate([
    cqrs_1.CommandHandler(create_param_command_1.CreateParamCommand),
    __metadata("design:paramtypes", [pageRepository_1.PageRepository,
        cqrs_1.EventPublisher])
], CreateSitemapHandler);
exports.CreateSitemapHandler = CreateSitemapHandler;
