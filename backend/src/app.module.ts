import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { TokenModule } from './token/token.module';
import { UsdtListenerModule } from './usdt-listener/usdt-listener.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FirebaseModule,
    TokenModule,
    UsdtListenerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
