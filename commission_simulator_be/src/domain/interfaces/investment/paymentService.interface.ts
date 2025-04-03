import {
  SinglePayment,
  PaymentStatusResponseData,
} from '../../entities/investment/payment.entity';

export interface PaymentService {
  createPayment(amount: number): Promise<SinglePayment>;
  checkPaymentStatus(address: string): Promise<PaymentStatusResponseData>;
  generateQrCode(address: string): Promise<string>;
}
