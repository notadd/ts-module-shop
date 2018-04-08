"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const delete_param_command_1 = require("../commands/impl/delete-param.command");
const common_1 = require("@nestjs/common");
require("rxjs/add/operator/map");
require("rxjs/add/operator/delay");
const page_curd_event_1 = require("../events/impl/page-curd.event");
const article_curd_events_1 = require("../events/impl/article-curd.events");
const clc = require('cli-color');
const itemId = '0';
let PageSagas = class PageSagas {
    constructor() {
        this.articleXml = (events$) => {
            return events$.ofType(article_curd_events_1.ArticleCurdEvents)
                .delay(1000)
                .map(event => {
                return new delete_param_command_1.DeleteParamCommand(event.heroId, itemId);
            });
        };
        this.pageXml = (events$) => {
            return events$.ofType(page_curd_event_1.PageCurdEvent)
                .delay(1000)
                .map(event => {
                return new delete_param_command_1.DeleteParamCommand(event.heroId, itemId);
            });
        };
    }
};
PageSagas = __decorate([
    common_1.Component()
], PageSagas);
exports.PageSagas = PageSagas;
