import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { FirebaseService } from '../firebase/firebase.service';
import { TokenService } from '../token/token.service';

@Injectable()
export class UsdtListenerService implements OnModuleInit {
  private readonly logger = new Logger(UsdtListenerService.name);
  private provider: ethers.Provider;
  private readonly usdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
  
  private readonly usdtAbi = [
    'event Transfer(address indexed from, address indexed to, uint256 value)',
    'function decimals() view returns (uint8)'
  ];

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly tokenService: TokenService,
  ) {}

  onModuleInit() {
    this.startListening();
  }

  startListening() {
    
    const rpcUrl = 'wss://ethereum-rpc.publicnode.com';
    this.logger.log(`Connecting to Ethereum RPC: ${rpcUrl}`);
    
    if (rpcUrl.startsWith('wss')) {
      this.provider = new ethers.WebSocketProvider(rpcUrl);
    } else {
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
    }

    const usdtContract = new ethers.Contract(this.usdtAddress, this.usdtAbi, this.provider);

    this.logger.log(`Listening for Transfer events on USDT Contract: ${this.usdtAddress} ...`);

    usdtContract.on('Transfer', async (from: string, to: string, value: bigint, event: ethers.Log) => {
      
      const threshold = 100_000n * 10n ** 6n;

      if (value >= threshold) {
        const amountFormatted = ethers.formatUnits(value, 6);
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

        this.firebaseService.sendMulticast(
          tokens,
          payloadData,
          "🚨 USDT Whale Alert",
          `${amountFormatted} USDT transferred!`
        );
      }
    });
  }
}
