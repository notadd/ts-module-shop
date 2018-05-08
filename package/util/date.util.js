"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
let DateUtil = class DateUtil {
    getString(date) {
        return date.getFullYear()
            + this.zero(date.getMonth() + 1)
            + this.zero(date.getDate())
            + this.zero(date.getHours())
            + this.zero(date.getMinutes())
            + this.zero(date.getSeconds());
    }
    zero(a) {
        if (a >= 10) {
            return a + "";
        }
        return "0" + a;
    }
};
DateUtil = __decorate([
    common_1.Component()
], DateUtil);
exports.DateUtil = DateUtil;
