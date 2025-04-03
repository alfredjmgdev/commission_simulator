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

export interface InvestmentCalculator {
  calculate(
    initialAmount: number,
    period: number,
    interestType: 'simple' | 'compound',
  ): InvestmentResult;
  generateCsv(result: InvestmentResult): string;
}
