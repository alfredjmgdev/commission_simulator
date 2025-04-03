import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InvestmentModule } from './infrastructure/modules/investment.module';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule, InvestmentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
