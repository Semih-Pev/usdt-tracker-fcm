import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  private tokens: Set<string> = new Set();

  registerToken(token: string) {
    this.tokens.add(token);
    this.logger.log(`FCM Token registered. Total tokens: ${this.tokens.size}`);
  }

  getAllTokens(): string[] {
    return Array.from(this.tokens);
  }
}
