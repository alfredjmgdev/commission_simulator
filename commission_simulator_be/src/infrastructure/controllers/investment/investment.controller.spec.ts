import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { InvestmentController } from './investment.controller';
import { CalculateInvestmentUseCase } from '../../../application/use-cases/investment/calculateInvestment.useCase';
import { GeneratePaymentUseCase } from '../../../application/use-cases/investment/generatePayment.useCase';
import { CalculateInvestmentDto } from '../../dtos/investment/calculateInvestment.dto';
import { GeneratePaymentDto } from '../../dtos/investment/generatePayment.dto';
import {
  SinglePayment,
  PaymentStatusResponseData,
  PaymentStatus,
  PaymentStatusTime,
} from '../../../domain/entities/investment/payment.entity';

describe('InvestmentController', () => {
  let controller: InvestmentController;
  let calculateInvestmentUseCase: CalculateInvestmentUseCase;
  let generatePaymentUseCase: GeneratePaymentUseCase;

  beforeEach(async () => {
    // Crear mocks para los casos de uso
    const mockCalculateInvestmentUseCase = {
      calculate: jest.fn(),
      generateCsv: jest.fn(),
    };

    const mockGeneratePaymentUseCase = {
      createPayment: jest.fn(),
      generateQrCode: jest.fn(),
      checkPaymentStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvestmentController],
      providers: [
        {
          provide: CalculateInvestmentUseCase,
          useValue: mockCalculateInvestmentUseCase,
        },
        {
          provide: GeneratePaymentUseCase,
          useValue: mockGeneratePaymentUseCase,
        },
      ],
    }).compile();

    controller = module.get<InvestmentController>(InvestmentController);
    calculateInvestmentUseCase = module.get<CalculateInvestmentUseCase>(
      CalculateInvestmentUseCase,
    );
    generatePaymentUseCase = module.get<GeneratePaymentUseCase>(
      GeneratePaymentUseCase,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('calculateInvestment', () => {
    it('should call calculate method with correct parameters', () => {
      // Arrange
      const dto: CalculateInvestmentDto = {
        initialAmount: 10000,
        period: 6,
        interestType: 'simple',
      };

      const expectedResult = {
        monthlyBreakdown: [
          { month: 1, balance: 10200, interest: 200, cumulativeInterest: 200 },
          { month: 2, balance: 10400, interest: 200, cumulativeInterest: 400 },
        ],
        finalAmount: 11200,
        totalInterest: 1200,
        fee: 112,
        netAmount: 11088,
      };

      jest
        .spyOn(calculateInvestmentUseCase, 'calculate')
        .mockReturnValue(expectedResult);

      // Act
      const result = controller.calculateInvestment(dto);

      // Assert
      expect(calculateInvestmentUseCase.calculate).toHaveBeenCalledWith(
        dto.initialAmount,
        dto.period,
        dto.interestType,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('exportCsv', () => {
    it('should generate and return CSV file', () => {
      // Arrange
      const initialAmount = 10000;
      const period = 6;
      const interestType = 'simple';

      const calculationResult = {
        monthlyBreakdown: [
          { month: 1, balance: 10200, interest: 200, cumulativeInterest: 200 },
          { month: 2, balance: 10400, interest: 200, cumulativeInterest: 400 },
        ],
        finalAmount: 11200,
        totalInterest: 1200,
        fee: 112,
        netAmount: 11088,
      };

      const csvContent =
        'Month,Balance,Monthly Interest,Cumulative Interest\n1,10200.00,200.00,200.00\n2,10400.00,200.00,400.00\n\nFinal Amount,11200.00\nTotal Interest,1200.00\nFee,112.00\nNet Amount,11088.00';

      jest
        .spyOn(calculateInvestmentUseCase, 'calculate')
        .mockReturnValue(calculationResult);
      jest
        .spyOn(calculateInvestmentUseCase, 'generateCsv')
        .mockReturnValue(csvContent);

      // Mock para el objeto Response
      const mockResponse = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      // Act
      controller.exportCsv(
        initialAmount,
        period,
        interestType as 'simple' | 'compound',
        mockResponse,
      );

      // Assert
      expect(calculateInvestmentUseCase.calculate).toHaveBeenCalledWith(
        initialAmount,
        period,
        interestType,
      );
      expect(calculateInvestmentUseCase.generateCsv).toHaveBeenCalledWith(
        calculationResult,
      );
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'text/csv',
      );
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        'attachment; filename=investment_simulation.csv',
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(csvContent);
    });
  });

  describe('generatePayment', () => {
    it('should generate payment and QR code', async () => {
      // Arrange
      const dto: GeneratePaymentDto = {
        amount: 10000,
      };

      const payment = new SinglePayment(
        'payment_address_123',
        'ethereum',
        10000,
        'smart_contract_address_123',
        ['account1', 'account2'],
      );

      const qrCodeData = 'data:image/png;base64,qrCodeImageBase64String';

      jest
        .spyOn(generatePaymentUseCase, 'createPayment')
        .mockResolvedValue(payment);
      jest
        .spyOn(generatePaymentUseCase, 'generateQrCode')
        .mockResolvedValue(qrCodeData);

      // Act
      const result = await controller.generatePayment(dto);

      // Assert
      expect(generatePaymentUseCase.createPayment).toHaveBeenCalledWith(
        dto.amount,
      );
      expect(generatePaymentUseCase.generateQrCode).toHaveBeenCalledWith(
        payment.address,
      );
      expect(result).toEqual({
        paymentAddress: payment.address,
        network: payment.network,
        amount: payment.fundsGoal,
        qrCodeData,
      });
    });
  });

  describe('checkPaymentStatus', () => {
    it('should return payment status', async () => {
      // Arrange
      const address = 'payment_address_123';

      const paymentStatus = new PaymentStatus(
        address,
        'ethereum',
        10000,
        'smart_contract_address_123',
        ['forward_address_1'],
        5000,
        'pending',
        'partial',
        2,
        4,
        5000,
        'ETH',
        1672531200000,
        true,
      );

      const paymentStatusTime = new PaymentStatusTime(
        1672444800000,
        1672448400000,
        3600000,
      );

      const paymentStatusResponseData = new PaymentStatusResponseData(
        paymentStatus,
        paymentStatusTime,
      );

      jest
        .spyOn(generatePaymentUseCase, 'checkPaymentStatus')
        .mockResolvedValue(paymentStatusResponseData);

      // Act
      const result = await controller.checkPaymentStatus(address);

      // Assert
      expect(generatePaymentUseCase.checkPaymentStatus).toHaveBeenCalledWith(
        address,
      );
      expect(result).toEqual(paymentStatusResponseData);
    });
  });
});
