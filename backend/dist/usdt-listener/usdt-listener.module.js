"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsdtListenerModule = void 0;
const common_1 = require("@nestjs/common");
const usdt_listener_service_1 = require("./usdt-listener.service");
const firebase_module_1 = require("../firebase/firebase.module");
const token_module_1 = require("../token/token.module");
let UsdtListenerModule = class UsdtListenerModule {
};
exports.UsdtListenerModule = UsdtListenerModule;
exports.UsdtListenerModule = UsdtListenerModule = __decorate([
    (0, common_1.Module)({
        imports: [firebase_module_1.FirebaseModule, token_module_1.TokenModule],
        providers: [usdt_listener_service_1.UsdtListenerService],
    })
], UsdtListenerModule);
//# sourceMappingURL=usdt-listener.module.js.map