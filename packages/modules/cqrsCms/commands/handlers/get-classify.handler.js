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
const get_classify_param_command_1 = require("../impl/get-classify-param.command");
const classify_service_1 = require("../../service/classify.service");
const clc = require('cli-color');
let GetClassifyHandler = class GetClassifyHandler {
    constructor(classifyService) {
        this.classifyService = classifyService;
    }
    execute(command, resolver) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(clc.greenBright('handlerCommand getClassify Command...'));
            let result;
            if (command.getClassify.useFor == 'page') {
                result = yield this.classifyService.findAllClassifyPage(1);
            }
            if (command.getClassify.useFor == 'art') {
                result = yield this.classifyService.findAllClassifyArt(1);
            }
            if (command.getClassify.getClassifyById) {
                result = yield this.classifyService.findClassifyById(command.getClassify.getClassifyById.useFor, command.getClassify.getClassifyById.id).then(a => { return a; });
            }
            resolver(result);
        });
    }
};
GetClassifyHandler = __decorate([
    cqrs_1.CommandHandler(get_classify_param_command_1.GetClassifyParamCommand),
    __metadata("design:paramtypes", [classify_service_1.ClassifyService])
], GetClassifyHandler);
exports.GetClassifyHandler = GetClassifyHandler;
