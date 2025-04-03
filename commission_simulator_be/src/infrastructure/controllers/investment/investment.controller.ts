import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { CalculateInvestmentUseCase } from '../../../application/use-cases/investment/calculateInvestment.useCase';
import { GeneratePaymentUseCase } from '../../../application/use-cases/investment/generatePayment.useCase';
import { CalculateInvestmentDto } from '../../dtos/investment/calculateInvestment.dto';
import { GeneratePaymentDto } from '../../dtos/investment/generatePayment.dto';
import { PaymentStatusResponseDataDto } from 'src/infrastructure/dtos/investment/paymentStatus.dto';

@Controller('api/investment')
@ApiTags('Investment')
export class InvestmentController {
  constructor(
    private readonly calculateInvestmentUseCase: CalculateInvestmentUseCase,
    private readonly generatePaymentUseCase: GeneratePaymentUseCase,
  ) {}

  @Post('calculate')
  @ApiOperation({ summary: 'Calculate investment returns' })
  @ApiResponse({
    status: 200,
    description: 'Returns investment calculation results',
  })
  calculateInvestment(@Body() dto: CalculateInvestmentDto) {
    return this.calculateInvestmentUseCase.calculate(
      dto.initialAmount,
      dto.period,
      dto.interestType,
    );
  }

  @Get('export-csv')
  @ApiOperation({ summary: 'Export investment calculation as CSV' })
  @ApiResponse({ status: 200, description: 'Returns CSV file' })
  exportCsv(
    @Query('initialAmount') initialAmount: number,
    @Query('period') period: number,
    @Query('interestType') interestType: 'simple' | 'compound',
    @Res() res: Response,
  ) {
    const result = this.calculateInvestmentUseCase.calculate(
      initialAmount,
      period,
      interestType,
    );

    const csv = this.calculateInvestmentUseCase.generateCsv(result);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=investment_simulation.csv',
    );
    return res.status(HttpStatus.OK).send(csv);
  }

  @Post('generate-payment')
  @ApiOperation({ summary: 'Generate payment QR code' })
  @ApiResponse({
    status: 200,
    description: 'Returns payment information with QR code',
  })
  async generatePayment(@Body() dto: GeneratePaymentDto) {
    const payment = await this.generatePaymentUseCase.createPayment(dto.amount);
    const qrCodeData = await this.generatePaymentUseCase.generateQrCode(
      payment.address,
    );

    return {
      paymentAddress: payment.address,
      network: payment.network,
      amount: payment.fundsGoal,
      qrCodeData,
    };
  }

  @Get('check-payment-status/:address')
  @ApiOperation({ summary: 'Check payment status' })
  @ApiResponse({
    status: 200,
    description: 'Returns payment status information',
  })
  async checkPaymentStatus(
    @Param('address') address: string,
  ): Promise<PaymentStatusResponseDataDto> {
    return await this.generatePaymentUseCase.checkPaymentStatus(address);
  }
}
