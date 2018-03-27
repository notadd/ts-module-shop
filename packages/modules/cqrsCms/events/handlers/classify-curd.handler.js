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
const classify_curd_events_1 = require("../impl/classify-curd.events");
const classify_service_1 = require("../../service/classify.service");
let ClassifyCurdEvent = class ClassifyCurdEvent {
    constructor(classifyservice) {
        this.classifyservice = classifyservice;
    }
    handle(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event.classify.createClassify) {
                if (event.classify.useFor == 'art') {
                    yield this.classifyservice.createClassifyArt(event.classify.createClassify.art);
                }
                if (event.classify.useFor == 'page') {
                    yield this.classifyservice.createClassifyPage(event.classify.createClassify.page);
                }
            }
            if (event.classify.updateClassify) {
                if (event.classify.useFor == 'art') {
                    yield this.classifyservice.updateClassifyArt(event.classify.updateClassify.art);
                }
                if (event.classify.useFor == 'page') {
                    yield this.classifyservice.updateClassifyPage(event.classify.updateClassify.page);
                }
            }
            if (event.classify.deleteClassify) {
                if (event.classify.useFor == 'art') {
                    yield this.classifyservice.deleteMethodFirst(event.classify.deleteClassify);
                }
                if (event.classify.useFor == 'page') {
                    yield this.classifyservice.deleteMethodSecond(event.classify.deleteClassify);
                }
            }
            if (event.classify.mobileClassifyId) {
                if (event.classify.useFor == 'art') {
                    yield this.classifyservice.mobileClassifyArt(event.classify.mobileClassifyId.id, event.classify.mobileClassifyId.parentId);
                }
                if (event.classify.useFor == 'page') {
                    yield this.classifyservice.mobileClassifyPage(event.classify.mobileClassifyId.id, event.classify.mobileClassifyId.parentId);
                }
            }
        });
    }
};
ClassifyCurdEvent = __decorate([
    cqrs_1.EventsHandler(classify_curd_events_1.ClassifyCurdEvents),
    __metadata("design:paramtypes", [classify_service_1.ClassifyService])
], ClassifyCurdEvent);
exports.ClassifyCurdEvent = ClassifyCurdEvent;
