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
var UsdtListenerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsdtListenerService = void 0;
const common_1 = require("@nestjs/common");
const ethers_1 = require("ethers");
const firebase_service_1 = require("../firebase/firebase.service");
const token_service_1 = require("../token/token.service");
let UsdtListenerService = UsdtListenerService_1 = class UsdtListenerService {
    firebaseService;
    tokenService;
    logger = new common_1.Logger(UsdtListenerService_1.name);
    provider;
    usdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
    usdtAbi = [
        'event Transfer(address indexed from, address indexed to, uint256 value)',
        'function decimals() view returns (uint8)'
    ];
    constructor(firebaseService, tokenService) {
        this.firebaseService = firebaseService;
        this.tokenService = tokenService;
    }
    onModuleInit() {
        this.startListening();
    }
    startListening() {
        const rpcUrl = 'wss://ethereum-rpc.publicnode.com';
        this.logger.log(`Connecting to Ethereum RPC: ${rpcUrl}`);
        if (rpcUrl.startsWith('wss')) {
            this.provider = new ethers_1.ethers.WebSocketProvider(rpcUrl);
        }
        else {
            this.provider = new ethers_1.ethers.JsonRpcProvider(rpcUrl);
        }
        const usdtContract = new ethers_1.ethers.Contract(this.usdtAddress, this.usdtAbi, this.provider);
        this.logger.log(`Listening for Transfer events on USDT Contract: ${this.usdtAddress} ...`);
        usdtContract.on('Transfer', async (from, to, value, event) => {
            const threshold = 100000n * 10n ** 6n;
            if (value >= threshold) {
                const amountFormatted = ethers_1.ethers.formatUnits(value, 6);
                const txHash = event.transactionHash;
                this.logger.log(`Whale Transfer Detected: ${amountFormatted} USDT from ${from} to ${to}. Hash: ${txHash}`);
                const tokens = this.tokenService.getAllTokens();
                const payloadData = {
                    sender: from,
                    to,
                    amount: amountFormatted,
                    txHash,
                    type: 'usdt_whale_transfer',
                };
                this.firebaseService.sendMulticast(tokens, payloadData, "🚨 USDT Whale Alert", `${amountFormatted} USDT transferred!`);
            }
        });
    }
};
exports.UsdtListenerService = UsdtListenerService;
exports.UsdtListenerService = UsdtListenerService = UsdtListenerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService,
        token_service_1.TokenService])
], UsdtListenerService);
//# sourceMappingURL=usdt-listener.service.js.map