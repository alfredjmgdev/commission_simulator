import { Test, TestingModule } from '@nestjs/testing';
import { CalculateInvestmentUseCase } from './calculateInvestment.useCase';
import { Investment } from '../../../domain/entities/investment/investment.entity';
import { InvestmentResult } from '../../../domain/interfaces/investment/investmentCalculator.interface';

describe('CalculateInvestmentUseCase', () => {
  let useCase: CalculateInvestmentUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalculateInvestmentUseCase],
    }).compile();

    useCase = module.get<CalculateInvestmentUseCase>(
      CalculateInvestmentUseCase,
    );
  });

  describe('calculate', () => {
    it('should calculate simple interest correctly', () => {
      // Arrange
      const initialAmount = 10000;
      const period = 6;
      const interestType = 'simple';
      const monthlyRate = 0.02; // 2% for 6 months

      // Mock static method
      jest.spyOn(Investment, 'getMonthlyRate').mockReturnValue(monthlyRate);
      jest.spyOn(Investment, 'calculateFeePercentage').mockReturnValue(0.01);

      // Act
      const result = useCase.calculate(
        initialAmount,
        period,
        interestType as 'simple' | 'compound',
      );

      // Assert
      expect(result.finalAmount).toBeCloseTo(11200); // 10000 + (10000 * 0.02 * 6)
      expect(result.totalInterest).toBeCloseTo(1200); // 10000 * 0.02 * 6
      expect(result.fee).toBeCloseTo(112); // 11200 * 0.01
      expect(result.netAmount).toBeCloseTo(11088); // 11200 - 112
      expect(result.monthlyBreakdown.length).toBe(6);

      // Check first month
      expect(result.monthlyBreakdown[0].month).toBe(1);
      expect(result.monthlyBreakdown[0].interest).toBeCloseTo(200); // 10000 * 0.02
      expect(result.monthlyBreakdown[0].balance).toBeCloseTo(10200); // 10000 + 200
      expect(result.monthlyBreakdown[0].cumulativeInterest).toBeCloseTo(200);

      // Check last month
      expect(result.monthlyBreakdown[5].month).toBe(6);
      expect(result.monthlyBreakdown[5].interest).toBeCloseTo(200); // 10000 * 0.02
      expect(result.monthlyBreakdown[5].balance).toBeCloseTo(11200); // 10000 + 200 * 6
      expect(result.monthlyBreakdown[5].cumulativeInterest).toBeCloseTo(1200); // 200 * 6
    });

    it('should calculate compound interest correctly', () => {
      // Arrange
      const initialAmount = 10000;
      const period = 6;
      const interestType = 'compound';
      const monthlyRate = 0.02; // 2% for 6 months

      // Mock static method
      jest.spyOn(Investment, 'getMonthlyRate').mockReturnValue(monthlyRate);
      jest.spyOn(Investment, 'calculateFeePercentage').mockReturnValue(0.01);

      // Act
      const result = useCase.calculate(
        initialAmount,
        period,
        interestType as 'simple' | 'compound',
      );

      // Assert
      // Compound interest calculation: 10000 * (1 + 0.02)^6
      const expectedFinalAmount = 10000 * Math.pow(1.02, 6);
      expect(result.finalAmount).toBeCloseTo(expectedFinalAmount);
      expect(result.totalInterest).toBeCloseTo(expectedFinalAmount - 10000);
      expect(result.fee).toBeCloseTo(expectedFinalAmount * 0.01);
      expect(result.netAmount).toBeCloseTo(
        expectedFinalAmount - expectedFinalAmount * 0.01,
      );
      expect(result.monthlyBreakdown.length).toBe(6);

      // Check first month
      expect(result.monthlyBreakdown[0].month).toBe(1);
      expect(result.monthlyBreakdown[0].interest).toBeCloseTo(200); // 10000 * 0.02
      expect(result.monthlyBreakdown[0].balance).toBeCloseTo(10200); // 10000 + 200
      expect(result.monthlyBreakdown[0].cumulativeInterest).toBeCloseTo(200);

      // Check second month (to verify compounding)
      expect(result.monthlyBreakdown[1].month).toBe(2);
      expect(result.monthlyBreakdown[1].interest).toBeCloseTo(204); // 10200 * 0.02
      expect(result.monthlyBreakdown[1].balance).toBeCloseTo(10404); // 10200 + 204
      expect(result.monthlyBreakdown[1].cumulativeInterest).toBeCloseTo(404); // 200 + 204
    });

    it('should use correct monthly rate based on period', () => {
      // Arrange
      const initialAmount = 10000;
      const interestType = 'simple';

      // Mock fee calculation to simplify test
      jest.spyOn(Investment, 'calculateFeePercentage').mockReturnValue(0.01);

      // Test for different periods
      const periods = [3, 6, 9, 12];
      const expectedRates = [0.01, 0.02, 0.03, 0.04]; // Rates from Investment.getMonthlyRate

      // Act & Assert
      periods.forEach((period, index) => {
        // Restore original implementation for this test
        jest.spyOn(Investment, 'getMonthlyRate').mockRestore();

        const result = useCase.calculate(
          initialAmount,
          period,
          interestType as 'simple' | 'compound',
        );

        // For simple interest, we can easily verify the rate was used correctly
        const actualRate = result.totalInterest / (initialAmount * period);
        expect(actualRate).toBeCloseTo(expectedRates[index]);
      });
    });

    it('should apply correct fee percentage based on final amount', () => {
      // Arrange
      const initialAmount = 10000;
      const period = 6;
      const interestType = 'simple';

      // Mock monthly rate to simplify test
      jest.spyOn(Investment, 'getMonthlyRate').mockReturnValue(0.02);

      // Test cases with different final amounts and expected fee percentages
      const testCases = [
        { finalAmount: 900, feePercentage: 0.02 }, // ≤ 1000: 2%
        { finalAmount: 5000, feePercentage: 0.01 }, // ≤ 10000: 1%
        { finalAmount: 20000, feePercentage: 0.005 }, // ≤ 35000: 0.5%
        { finalAmount: 50000, feePercentage: 0.0025 }, // > 35000: 0.25%
      ];

      testCases.forEach((testCase) => {
        // Mock the final amount calculation
        jest
          .spyOn(Investment, 'calculateFeePercentage')
          .mockReturnValue(testCase.feePercentage);

        // Act
        const result = useCase.calculate(
          initialAmount,
          period,
          interestType as 'simple' | 'compound',
        );

        // Assert
        expect(result.fee).toBeCloseTo(
          result.finalAmount * testCase.feePercentage,
        );
      });
    });
  });

  describe('generateCsv', () => {
    it('should generate CSV with correct format', () => {
      // Arrange
      const mockResult: InvestmentResult = {
        monthlyBreakdown: [
          { month: 1, balance: 10200, interest: 200, cumulativeInterest: 200 },
          { month: 2, balance: 10400, interest: 200, cumulativeInterest: 400 },
        ],
        finalAmount: 10400,
        totalInterest: 400,
        fee: 104,
        netAmount: 10296,
      };

      // Act
      const csv = useCase.generateCsv(mockResult);

      // Assert
      const expectedCsv =
        'Month,Balance,Monthly Interest,Cumulative Interest\n' +
        '1,10200.00,200.00,200.00\n' +
        '2,10400.00,200.00,400.00\n\n' +
        'Final Amount,10400.00\n' +
        'Total Interest,400.00\n' +
        'Fee,104.00\n' +
        'Net Amount,10296.00';

      expect(csv).toBe(expectedCsv);
    });

    it('should handle empty monthly breakdown', () => {
      // Arrange
      const mockResult: InvestmentResult = {
        monthlyBreakdown: [],
        finalAmount: 10000,
        totalInterest: 0,
        fee: 0,
        netAmount: 10000,
      };

      // Act
      const csv = useCase.generateCsv(mockResult);

      // Assert
      const expectedCsv =
        'Month,Balance,Monthly Interest,Cumulative Interest\n' +
        '\n\n' +
        'Final Amount,10000.00\n' +
        'Total Interest,0.00\n' +
        'Fee,0.00\n' +
        'Net Amount,10000.00';

      expect(csv).toBe(expectedCsv);
    });
  });
});
