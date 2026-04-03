import { OnModuleInit } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { TokenService } from '../token/token.service';
export declare class UsdtListenerService implements OnModuleInit {
    private readonly firebaseService;
    private readonly tokenService;
    private readonly logger;
    private provider;
    private readonly usdtAddress;
    private readonly usdtAbi;
    constructor(firebaseService: FirebaseService, tokenService: TokenService);
    onModuleInit(): void;
    startListening(): void;
}
