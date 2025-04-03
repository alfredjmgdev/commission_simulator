export interface InvestmentFormData {
  initialAmount: number;
  period: 3 | 6 | 9 | 12;
  interestType: "simple" | "compound";
}

export interface MonthlyBreakdown {
  month: number;
  balance: number;
  interest: number;
  cumulativeInterest: number;
}

export interface InvestmentResult {
  monthlyBreakdown: MonthlyBreakdown[];
  finalAmount: number;
  totalInterest: number;
  fee: number;
  netAmount: number;
}

export interface PaymentData {
  paymentAddress: string;
  network: string;
  amount: number;
  qrCodeData: string;
}

export interface PaymentStatus {
  data: {
    address: string;
    network: string;
    fundsGoal: number;
    smartContractAddress: string;
    amountCaptured: number;
    status: string;
    fundStatus: string;
    processStep: number;
    processTotalSteps: number;
    isPaymentReceived: boolean;
    currentBalance: number;
    smartContractSymbol: string;
    fundsExpirationAt: number;
    forwardAddresses: string[];
  };
  time: {
    timeStart: number;
    timeEnd: number;
    timeDelta: number;
  };
}
