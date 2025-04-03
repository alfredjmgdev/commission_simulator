export interface BasePaymentResponseData {
  address: string;
  network: string;
  fundsGoal: number;
  smartContractAddress: string;
}

export interface SinglePaymentResponseData extends BasePaymentResponseData {
  accounts?: string[];
}

export interface PaymentStatusResponseData extends BasePaymentResponseData {
  forwardAddresses?: string[];
  amountCaptured?: number;
  status?: string;
  fundStatus?: string;
  processStep?: number;
  processTotalSteps?: number;
  currentBalance?: number;
  smartContractSymbol?: string;
  fundsExpirationAt?: number;
}

export interface PaymentStatusResponse {
  data: PaymentStatusResponseData;
  timeStart?: number;
  timeEnd?: number;
  timeDelta?: number;
}
