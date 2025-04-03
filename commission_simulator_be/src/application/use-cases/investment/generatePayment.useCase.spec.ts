import { Test, TestingModule } from '@nestjs/testing';
import { GeneratePaymentUseCase } from './generatePayment.useCase';
import { PaymentRepository } from '../../../domain/repositories/investment/paymentRepository.interface';
import {
  SinglePayment,
  PaymentStatusResponseData,
  PaymentStatus,
  PaymentStatusTime,
} from '../../../domain/entities/investment/payment.entity';
import * as QRCode from 'qrcode';

// Mock para QRCode
jest.mock('qrcode', () => ({
  toDataURL: jest.fn(),
}));

describe('GeneratePaymentUseCase', () => {
  let useCase: GeneratePaymentUseCase;
  let paymentRepository: PaymentRepository;

  const mockSinglePayment = new SinglePayment(
    'test-address',
    'test-network',
    1000,
    'test-contract-address',
    ['test-account'],
  );

  const mockPaymentStatus = new PaymentStatus(
    'test-address',
    'test-network',
    1000,
    'test-contract-address',
    ['test-forward-address'],
    500,
    'pending',
    'partial',
    1,
    3,
    500,
    'USDT',
    1234567890,
    true,
  );

  const mockPaymentStatusTime = new PaymentStatusTime(
    1234567890,
    1234568890,
    1000,
  );

  const mockPaymentStatusResponseData = new PaymentStatusResponseData(
    mockPaymentStatus,
    mockPaymentStatusTime,
  );

  beforeEach(async () => {
    const mockPaymentRepository = {
      createSinglePayment: jest.fn(),
      getPaymentStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeneratePaymentUseCase,
        {
          provide: 'PaymentRepository',
          useValue: mockPaymentRepository,
        },
      ],
    }).compile();

    useCase = module.get<GeneratePaymentUseCase>(GeneratePaymentUseCase);
    paymentRepository = module.get<PaymentRepository>('PaymentRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('createPayment', () => {
    it('should call repository createSinglePayment with correct amount', async () => {
      const amount = 1000;
      jest
        .spyOn(paymentRepository, 'createSinglePayment')
        .mockResolvedValue(mockSinglePayment);

      const result = await useCase.createPayment(amount);

      expect(paymentRepository.createSinglePayment).toHaveBeenCalledWith(
        amount,
      );
      expect(result).toEqual(mockSinglePayment);
    });

    it('should propagate errors from repository', async () => {
      const amount = 1000;
      const error = new Error('Repository error');
      jest
        .spyOn(paymentRepository, 'createSinglePayment')
        .mockRejectedValue(error);

      await expect(useCase.createPayment(amount)).rejects.toThrow(error);
    });
  });

  describe('checkPaymentStatus', () => {
    it('should call repository getPaymentStatus with correct address', async () => {
      const address = 'test-address';
      jest
        .spyOn(paymentRepository, 'getPaymentStatus')
        .mockResolvedValue(mockPaymentStatusResponseData);

      const result = await useCase.checkPaymentStatus(address);

      expect(paymentRepository.getPaymentStatus).toHaveBeenCalledWith(address);
      expect(result).toEqual(mockPaymentStatusResponseData);
    });

    it('should propagate errors from repository', async () => {
      const address = 'test-address';
      const error = new Error('Repository error');
      jest
        .spyOn(paymentRepository, 'getPaymentStatus')
        .mockRejectedValue(error);

      await expect(useCase.checkPaymentStatus(address)).rejects.toThrow(error);
    });
  });

  describe('generateQrCode', () => {
    it('should call QRCode.toDataURL with correct address', async () => {
      const address = 'test-address';
      const qrCodeData = 'data:image/png;base64,test-qr-code-data';
      (QRCode.toDataURL as jest.Mock).mockResolvedValue(qrCodeData);

      const result = await useCase.generateQrCode(address);

      expect(QRCode.toDataURL).toHaveBeenCalledWith(address);
      expect(result).toBe(qrCodeData);
    });

    it('should throw error when QRCode generation fails', async () => {
      const address = 'test-address';
      const error = new Error('QR code generation failed');
      (QRCode.toDataURL as jest.Mock).mockRejectedValue(error);

      await expect(useCase.generateQrCode(address)).rejects.toThrow(
        'Failed to generate QR code: QR code generation failed',
      );
    });
  });
});
