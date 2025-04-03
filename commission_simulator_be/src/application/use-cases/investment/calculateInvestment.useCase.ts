import { Injectable } from '@nestjs/common';
import { Investment } from '../../../domain/entities/investment/investment.entity';
import {
  InvestmentCalculator,
  InvestmentResult,
  MonthlyBreakdown,
} from '../../../domain/interfaces/investment/investmentCalculator.interface';

@Injectable()
export class CalculateInvestmentUseCase implements InvestmentCalculator {
  calculate(
    initialAmount: number,
    period: number,
    interestType: 'simple' | 'compound',
  ): InvestmentResult {
    const monthlyRate = Investment.getMonthlyRate(period);
    const monthlyBreakdown: MonthlyBreakdown[] = [];

    let balance = initialAmount;
    let cumulativeInterest = 0;

    for (let month = 1; month <= period; month++) {
      let interest: number;

      if (interestType === 'simple') {
        // Simple interest: same interest amount each month
        interest = initialAmount * monthlyRate;
        balance = initialAmount + interest * month;
      } else {
        // Compound interest: interest calculated on current balance
        interest = balance * monthlyRate;
        balance += interest;
      }

      cumulativeInterest += interest;

      monthlyBreakdown.push({
        month,
        balance,
        interest,
        cumulativeInterest,
      });
    }

    const finalAmount = balance;
    const totalInterest = cumulativeInterest;
    const feePercentage = Investment.calculateFeePercentage(finalAmount);
    const fee = finalAmount * feePercentage;
    const netAmount = finalAmount - fee;

    return {
      monthlyBreakdown,
      finalAmount,
      totalInterest,
      fee,
      netAmount,
    };
  }

  generateCsv(result: InvestmentResult): string {
    const headers = 'Month,Balance,Monthly Interest,Cumulative Interest\n';
    const rows = result.monthlyBreakdown
      .map(
        (row) =>
          `${row.month},${row.balance.toFixed(2)},${row.interest.toFixed(2)},${row.cumulativeInterest.toFixed(2)}`,
      )
      .join('\n');

    const summary =
      `\n\nFinal Amount,${result.finalAmount.toFixed(2)}\n` +
      `Total Interest,${result.totalInterest.toFixed(2)}\n` +
      `Fee,${result.fee.toFixed(2)}\n` +
      `Net Amount,${result.netAmount.toFixed(2)}`;

    return headers + rows + summary;
  }
}
