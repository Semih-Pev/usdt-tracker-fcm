import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { FirebaseService } from './firebase/firebase.service';
import { TokenService } from './token/token.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly firebaseService: FirebaseService,
    private readonly tokenService: TokenService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-whale')
  async triggerFakeWhale() {
    const tokens = this.tokenService.getAllTokens();
    if (tokens.length === 0) return { status: "No tokens registered" };

    const payloadData = {
      sender: "0xFakeSender123",
      to: "0xFakeReceiver456",
      amount: "999999.0",
      txHash: "0xfakehash123",
      type: 'usdt_whale_transfer',
    };

    const response = await this.firebaseService.sendMulticast(
      tokens,
      payloadData,
      "🚨 TEST WHALE ALERT",
      "999999.0 USDT transferred! (TEST)"
    );

    return { status: "Test sent!", tokens: tokens.length, response };
  }
}
