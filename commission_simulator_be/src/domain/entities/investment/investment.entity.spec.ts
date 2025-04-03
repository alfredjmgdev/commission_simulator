import { Investment } from './investment.entity';

describe('Investment', () => {
  describe('constructor', () => {
    it('should create an instance with the provided values', () => {
      // Arrange & Act
      const investment = new Investment(10000, 6, 'simple');

      // Assert
      expect(investment).toBeDefined();
      expect(investment.initialAmount).toBe(10000);
      expect(investment.period).toBe(6);
      expect(investment.interestType).toBe('simple');
    });

    it('should create an instance with compound interest type', () => {
      // Arrange & Act
      const investment = new Investment(5000, 12, 'compound');

      // Assert
      expect(investment).toBeDefined();
      expect(investment.initialAmount).toBe(5000);
      expect(investment.period).toBe(12);
      expect(investment.interestType).toBe('compound');
    });
  });

  describe('getMonthlyRate', () => {
    it('should return 1% for 3 months period', () => {
      // Act
      const rate = Investment.getMonthlyRate(3);

      // Assert
      expect(rate).toBe(0.01);
    });

    it('should return 2% for 6 months period', () => {
      // Act
      const rate = Investment.getMonthlyRate(6);

      // Assert
      expect(rate).toBe(0.02);
    });

    it('should return 3% for 9 months period', () => {
      // Act
      const rate = Investment.getMonthlyRate(9);

      // Assert
      expect(rate).toBe(0.03);
    });

    it('should return 4% for 12 months period', () => {
      // Act
      const rate = Investment.getMonthlyRate(12);

      // Assert
      expect(rate).toBe(0.04);
    });

    it('should throw an error for invalid period', () => {
      // Act & Assert
      expect(() => Investment.getMonthlyRate(5)).toThrow('Invalid period');
      expect(() => Investment.getMonthlyRate(0)).toThrow('Invalid period');
      expect(() => Investment.getMonthlyRate(-1)).toThrow('Invalid period');
    });
  });

  describe('calculateFeePercentage', () => {
    it('should return 2% for amounts <= 1000', () => {
      // Act & Assert
      expect(Investment.calculateFeePercentage(500)).toBe(0.02);
      expect(Investment.calculateFeePercentage(1000)).toBe(0.02);
    });

    it('should return 1% for amounts > 1000 and <= 10000', () => {
      // Act & Assert
      expect(Investment.calculateFeePercentage(1001)).toBe(0.01);
      expect(Investment.calculateFeePercentage(5000)).toBe(0.01);
      expect(Investment.calculateFeePercentage(10000)).toBe(0.01);
    });

    it('should return 0.5% for amounts > 10000 and <= 35000', () => {
      // Act & Assert
      expect(Investment.calculateFeePercentage(10001)).toBe(0.005);
      expect(Investment.calculateFeePercentage(20000)).toBe(0.005);
      expect(Investment.calculateFeePercentage(35000)).toBe(0.005);
    });

    it('should return 0.25% for amounts > 35000', () => {
      // Act & Assert
      expect(Investment.calculateFeePercentage(35001)).toBe(0.0025);
      expect(Investment.calculateFeePercentage(50000)).toBe(0.0025);
      expect(Investment.calculateFeePercentage(1000000)).toBe(0.0025);
    });

    it('should handle edge cases correctly', () => {
      // Act & Assert
      expect(Investment.calculateFeePercentage(0)).toBe(0.02); // Zero amount
      expect(Investment.calculateFeePercentage(-100)).toBe(0.02); // Negative amount (though this shouldn't happen in practice)
    });

    it('should handle decimal amounts correctly', () => {
      // Act & Assert
      expect(Investment.calculateFeePercentage(999.99)).toBe(0.02);
      expect(Investment.calculateFeePercentage(1000.01)).toBe(0.01);
      expect(Investment.calculateFeePercentage(10000.01)).toBe(0.005);
      expect(Investment.calculateFeePercentage(35000.01)).toBe(0.0025);
    });
  });
});
