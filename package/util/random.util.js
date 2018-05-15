"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
let RandomUtil = class RandomUtil {
    constructor() {
        this.chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    }
    getRandom(n) {
        let res = "";
        for (let i = 0; i < n; i++) {
            const id = Math.ceil(Math.random() * 9);
            res += this.chars[id];
        }
        return res;
    }
};
RandomUtil = __decorate([
    common_1.Injectable()
], RandomUtil);
exports.RandomUtil = RandomUtil;

//# sourceMappingURL=random.util.js.map
