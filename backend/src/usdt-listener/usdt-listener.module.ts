import { Module } from '@nestjs/common';
import { UsdtListenerService } from './usdt-listener.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [FirebaseModule, TokenModule],
  providers: [UsdtListenerService],
})
export class UsdtListenerModule {}
