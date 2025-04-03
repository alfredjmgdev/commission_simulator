import {
  SinglePayment,
  PaymentStatusResponseData,
} from '../../entities/investment/payment.entity';

export interface PaymentRepository {
  createSinglePayment(amount: number): Promise<SinglePayment>;
  getPaymentStatus(address: string): Promise<PaymentStatusResponseData>;
}
