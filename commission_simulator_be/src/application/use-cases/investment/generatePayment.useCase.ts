import { Injectable, Inject } from '@nestjs/common';
import {
  SinglePayment,
  PaymentStatusResponseData,
} from '../../../domain/entities/investment/payment.entity';
import { PaymentService } from '../../../domain/interfaces/investment/paymentService.interface';
import { PaymentRepository } from '../../../domain/repositories/investment/paymentRepository.interface';
import * as QRCode from 'qrcode';

@Injectable()
export class GeneratePaymentUseCase implements PaymentService {
  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async createPayment(amount: number): Promise<SinglePayment> {
    return this.paymentRepository.createSinglePayment(amount);
  }

  async checkPaymentStatus(
    address: string,
  ): Promise<PaymentStatusResponseData> {
    return this.paymentRepository.getPaymentStatus(address);
  }

  async generateQrCode(address: string): Promise<string> {
    try {
      return await QRCode.toDataURL(address);
    } catch (error) {
      throw new Error(`Failed to generate QR code: ${error.message}`);
    }
  }
}
