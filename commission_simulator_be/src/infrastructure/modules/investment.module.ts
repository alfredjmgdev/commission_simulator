import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CalculateInvestmentUseCase } from '../../application/use-cases/investment/calculateInvestment.useCase';
import { GeneratePaymentUseCase } from '../../application/use-cases/investment/generatePayment.useCase';
import { InvestmentController } from '../controllers/investment/investment.controller';
import { DisruptivePaymentRepository } from '../repositories/investment/disruptivePayment.repository';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  controllers: [InvestmentController],
  providers: [
    CalculateInvestmentUseCase,
    GeneratePaymentUseCase,
    {
      provide: 'PaymentRepository',
      useClass: DisruptivePaymentRepository,
    },
  ],
  exports: [CalculateInvestmentUseCase, GeneratePaymentUseCase],
})
export class InvestmentModule {}
