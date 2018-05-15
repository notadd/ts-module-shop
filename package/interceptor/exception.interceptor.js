"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
require("rxjs/add/operator/catch");
let ExceptionInterceptor = class ExceptionInterceptor {
    intercept(context, stream$) {
        return stream$.catch((err, caught) => {
            if (err instanceof common_1.HttpException) {
                return Promise.resolve({
                    code: err.getStatus(),
                    message: err.getResponse()
                });
            }
            else if (err instanceof Error) {
                return Promise.resolve({
                    code: 500,
                    message: "出现了意外错误:" + err.name + "\n" + err.message + "\n" + err.stack
                });
            }
            else {
                return Promise.resolve({
                    code: 500,
                    message: "出现了意外错误:" + err.toString()
                });
            }
        });
    }
};
ExceptionInterceptor = __decorate([
    common_1.Injectable()
], ExceptionInterceptor);
exports.ExceptionInterceptor = ExceptionInterceptor;

//# sourceMappingURL=exception.interceptor.js.map
