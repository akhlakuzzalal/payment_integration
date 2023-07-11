import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: `.env` }), PaymentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
