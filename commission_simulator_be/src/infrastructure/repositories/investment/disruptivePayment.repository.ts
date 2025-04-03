import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PaymentRepository } from '../../../domain/repositories/investment/paymentRepository.interface';
import {
  SinglePayment,
  PaymentStatus,
  PaymentStatusResponseData,
  PaymentStatusTime,
} from '../../../domain/entities/investment/payment.entity';
import { ConfigService } from '@nestjs/config';
import {
  SinglePaymentResponseData,
  PaymentStatusResponse,
} from '../../../domain/interfaces/investment/paymentResponseData.interface';

@Injectable()
export class DisruptivePaymentRepository implements PaymentRepository {
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly smartContractAddress: string;
  private readonly network: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.getRequiredEnv('DISRUPTIVE_PAYMENT_API_URL');
    this.apiKey = this.getRequiredEnv('DISRUPTIVE_PAYMENT_API_KEY');
    this.smartContractAddress = this.getRequiredEnv(
      'DISRUPTIVE_PAYMENT_SMART_CONTRACT_ADDRESS',
    );
    this.network = this.getRequiredEnv('DISRUPTIVE_PAYMENT_NETWORK');
  }

  private getRequiredEnv(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) {
      throw new Error(`Environment variable ${key} is required but not set`);
    }
    return value;
  }

  private getHeaders() {
    return {
      'client-api-key': this.apiKey,
      'content-type': 'application/json',
    };
  }

  async createSinglePayment(amount: number): Promise<SinglePayment> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.apiUrl}/payments/single`,
          {
            network: this.network,
            fundsGoal: amount,
            smartContractAddress: this.smartContractAddress,
          },
          { headers: this.getHeaders() },
        ),
      );

      if (response.status !== 200) {
        throw new HttpException(
          `La API de pagos respondió con estado ${response.status}`,
          response.status || HttpStatus.BAD_GATEWAY,
        );
      }

      const data = response.data.data as SinglePaymentResponseData;

      return new SinglePayment(
        data.address,
        data.network,
        data.fundsGoal,
        data.smartContractAddress,
        data.accounts || [],
      );
    } catch (error: any) {
      if ('isAxiosError' in error || 'response' in error) {
        const status = error.response?.status || HttpStatus.BAD_REQUEST;
        const errorMessage =
          error.response?.data?.errorMessage || error.message;
        throw new HttpException(
          `Failed to get payment status: ${errorMessage}`,
          status,
        );
      } else {
        throw new HttpException(
          `Failed to get payment status: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getPaymentStatus(address: string): Promise<PaymentStatusResponseData> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.apiUrl}/payments/status?network=${this.network}&address=${address}`,
          { headers: this.getHeaders() },
        ),
      );

      if (response.status !== 200) {
        throw new HttpException(
          `La API de pagos respondió con estado ${response.status}`,
          response.status || HttpStatus.BAD_GATEWAY,
        );
      }

      const responseData = response.data as PaymentStatusResponse;
      const data = responseData.data;
      const timeStart = responseData.timeStart;
      const timeEnd = responseData.timeEnd;
      const timeDelta = responseData.timeDelta;

      const paymentStatus = new PaymentStatus(
        data.address,
        data.network,
        data.fundsGoal,
        data.smartContractAddress,
        data.forwardAddresses || [],
        data.amountCaptured || 0,
        data.status || '',
        data.fundStatus || '',
        data.processStep || 0,
        data.processTotalSteps || 0,
        data.currentBalance || 0,
        data.smartContractSymbol || '',
        data.fundsExpirationAt || 0,
        data.amountCaptured > 0,
      );

      const paymentStatusTime = new PaymentStatusTime(
        timeStart,
        timeEnd,
        timeDelta,
      );

      return new PaymentStatusResponseData(paymentStatus, paymentStatusTime);
    } catch (error: any) {
      if ('isAxiosError' in error || 'response' in error) {
        const status = error.response?.status || HttpStatus.BAD_REQUEST;
        const errorMessage =
          error.response?.data?.errorMessage || error.message;
        throw new HttpException(
          `Failed to get payment status: ${errorMessage}`,
          status,
        );
      } else {
        throw new HttpException(
          `Failed to get payment status: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
