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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
const exception_interceptor_1 = require("../interceptor/exception.interceptor");
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const member_service_1 = require("../service/member.service");
let MemberResolver = class MemberResolver {
    constructor(memberService) {
        this.memberService = memberService;
    }
    members(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const members = yield this.memberService.getMembers();
            return { code: 200, message: "获取所有会员成功", members };
        });
    }
    member(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            const member = yield this.memberService.getMember(id);
            return { code: 200, message: "获取指定id会员成功", member };
        });
    }
    createMember(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, realName, email, sex, idNumber, birthday, password, mobilePhone } = body;
            if (!name || !realName || !email || !sex || !idNumber || !birthday || !password || !mobilePhone) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            yield this.memberService.createMember(name, realName, email, sex, idNumber, birthday, password, mobilePhone);
            return { code: 200, message: "创建会员成功" };
        });
    }
    updateMember(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, email, sex, birthday, password, mobilePhone } = body;
            if (!id || !email || !sex || !birthday || !password || !mobilePhone) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            yield this.memberService.updateMember(id, email, sex, birthday, password, mobilePhone);
            return { code: 200, message: "更新会员成功" };
        });
    }
    deleteMember(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            if (!id) {
                throw new common_1.HttpException("缺少参数", 404);
            }
            yield this.memberService.deleteMember(id);
            return { code: 200, message: "删除会员成功" };
        });
    }
};
__decorate([
    graphql_1.Query("members"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "members", null);
__decorate([
    graphql_1.Query("member"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "member", null);
__decorate([
    graphql_1.Mutation("createMember"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "createMember", null);
__decorate([
    graphql_1.Mutation("updateMember"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "updateMember", null);
__decorate([
    graphql_1.Mutation("deleteMember"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "deleteMember", null);
MemberResolver = __decorate([
    graphql_1.Resolver("Member"),
    common_1.UseInterceptors(exception_interceptor_1.ExceptionInterceptor),
    __param(0, common_1.Inject(member_service_1.MemberService)),
    __metadata("design:paramtypes", [member_service_1.MemberService])
], MemberResolver);
exports.MemberResolver = MemberResolver;

//# sourceMappingURL=member.resolver.js.map
