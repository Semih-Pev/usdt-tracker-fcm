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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const firebase_service_1 = require("./firebase/firebase.service");
const token_service_1 = require("./token/token.service");
let AppController = class AppController {
    appService;
    firebaseService;
    tokenService;
    constructor(appService, firebaseService, tokenService) {
        this.appService = appService;
        this.firebaseService = firebaseService;
        this.tokenService = tokenService;
    }
    getHello() {
        return this.appService.getHello();
    }
    async triggerFakeWhale() {
        const tokens = this.tokenService.getAllTokens();
        if (tokens.length === 0)
            return { status: "No tokens registered" };
        const payloadData = {
            sender: "0xFakeSender123",
            to: "0xFakeReceiver456",
            amount: "999999.0",
            txHash: "0xfakehash123",
            type: 'usdt_whale_transfer',
        };
        const response = await this.firebaseService.sendMulticast(tokens, payloadData, "🚨 TEST WHALE ALERT", "999999.0 USDT transferred! (TEST)");
        return { status: "Test sent!", tokens: tokens.length, response };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('test-whale'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "triggerFakeWhale", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        firebase_service_1.FirebaseService,
        token_service_1.TokenService])
], AppController);
//# sourceMappingURL=app.controller.js.map