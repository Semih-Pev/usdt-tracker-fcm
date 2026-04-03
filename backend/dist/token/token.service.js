"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TokenService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
let TokenService = TokenService_1 = class TokenService {
    logger = new common_1.Logger(TokenService_1.name);
    tokens = new Set();
    registerToken(token) {
        this.tokens.add(token);
        this.logger.log(`FCM Token registered. Total tokens: ${this.tokens.size}`);
    }
    getAllTokens() {
        return Array.from(this.tokens);
    }
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = TokenService_1 = __decorate([
    (0, common_1.Injectable)()
], TokenService);
//# sourceMappingURL=token.service.js.map