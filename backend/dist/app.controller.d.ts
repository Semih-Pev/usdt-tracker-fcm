import { AppService } from './app.service';
import { FirebaseService } from './firebase/firebase.service';
import { TokenService } from './token/token.service';
export declare class AppController {
    private readonly appService;
    private readonly firebaseService;
    private readonly tokenService;
    constructor(appService: AppService, firebaseService: FirebaseService, tokenService: TokenService);
    getHello(): string;
    triggerFakeWhale(): Promise<{
        status: string;
        tokens?: undefined;
        response?: undefined;
    } | {
        status: string;
        tokens: number;
        response: import("node_modules/firebase-admin/lib/messaging/messaging-api").BatchResponse | undefined;
    }>;
}
