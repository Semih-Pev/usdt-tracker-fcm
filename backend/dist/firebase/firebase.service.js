"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var FirebaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseService = void 0;
const common_1 = require("@nestjs/common");
const admin = __importStar(require("firebase-admin"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let FirebaseService = FirebaseService_1 = class FirebaseService {
    logger = new common_1.Logger(FirebaseService_1.name);
    onApplicationBootstrap() {
        try {
            let credentialOptions;
            const serviceAccountPath = path.resolve(process.cwd(), 'firebase-service-account.json');
            if (fs.existsSync(serviceAccountPath)) {
                credentialOptions = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
            }
            else if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL) {
                credentialOptions = {
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                };
            }
            if (!credentialOptions) {
                this.logger.warn('Firebase Admin credentials missing. Ensure firebase-service-account.json exists or .env is configured properly.');
                return;
            }
            admin.initializeApp({
                credential: admin.credential.cert(credentialOptions),
            });
            this.logger.log('Firebase Admin initialized successfully.');
        }
        catch (e) {
            this.logger.error('Error initializing Firebase admin:', e);
        }
    }
    async sendMulticast(tokens, data, title, body) {
        if (!admin.apps.length) {
            this.logger.warn('Firebase not initialized. Can not send notification.');
            return;
        }
        if (tokens.length === 0) {
            this.logger.log('No FCM tokens registered. Skipping notification.');
            return;
        }
        try {
            const stringifiedData = {};
            for (const [key, value] of Object.entries(data)) {
                stringifiedData[key] = String(value);
            }
            const response = await admin.messaging().sendEachForMulticast({
                tokens,
                data: stringifiedData,
                notification: {
                    title,
                    body,
                },
            });
            this.logger.log(`Sent FCM notifications. Success: ${response.successCount}, Failure: ${response.failureCount}`);
            return response;
        }
        catch (e) {
            this.logger.error('Error sending multicast message:', e);
        }
    }
};
exports.FirebaseService = FirebaseService;
exports.FirebaseService = FirebaseService = FirebaseService_1 = __decorate([
    (0, common_1.Injectable)()
], FirebaseService);
//# sourceMappingURL=firebase.service.js.map