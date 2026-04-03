import { TokenService } from './token.service';
export declare class TokenController {
    private readonly tokenService;
    constructor(tokenService: TokenService);
    registerDevice(token: string): {
        success: boolean;
        message: string;
    } | {
        success: boolean;
        message?: undefined;
    };
}
