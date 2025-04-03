import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CalculateInvestmentDto } from './calculateInvestment.dto';

describe('CalculateInvestmentDto', () => {
  it('should pass validation with valid data', async () => {
    // Arrange
    const validData = {
      initialAmount: 10000,
      period: 6,
      interestType: 'simple',
    };

    // Act
    const dto = plainToInstance(CalculateInvestmentDto, validData);
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(0);
  });

  describe('initialAmount validation', () => {
    it('should fail validation when initialAmount is missing', async () => {
      // Arrange
      const invalidData = {
        period: 6,
        interestType: 'simple',
      };

      // Act
      const dto = plainToInstance(CalculateInvestmentDto, invalidData);
      const errors = await validate(dto);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('initialAmount');
    });

    it('should fail validation when initialAmount is not a number', async () => {
      // Arrange
      const invalidData = {
        initialAmount: 'not-a-number',
        period: 6,
        interestType: 'simple',
      };

      // Act
      const dto = plainToInstance(CalculateInvestmentDto, invalidData);
      const errors = await validate(dto);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('initialAmount');
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });

    it('should fail validation when initialAmount is less than 1', async () => {
      // Arrange
      const invalidData = {
        initialAmount: 0,
        period: 6,
        interestType: 'simple',
      };

      // Act
      const dto = plainToInstance(CalculateInvestmentDto, invalidData);
      const errors = await validate(dto);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('initialAmount');
      expect(errors[0].constraints).toHaveProperty('min');
    });
  });

  describe('period validation', () => {
    it('should fail validation when period is missing', async () => {
      // Arrange
      const invalidData = {
        initialAmount: 10000,
        interestType: 'simple',
      };

      // Act
      const dto = plainToInstance(CalculateInvestmentDto, invalidData);
      const errors = await validate(dto);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('period');
    });

    it('should fail validation when period is not a number', async () => {
      // Arrange
      const invalidData = {
        initialAmount: 10000,
        period: 'not-a-number',
        interestType: 'simple',
      };

      // Act
      const dto = plainToInstance(CalculateInvestmentDto, invalidData);
      const errors = await validate(dto);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('period');
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });

    it('should fail validation when period is not one of the allowed values', async () => {
      // Arrange
      const invalidData = {
        initialAmount: 10000,
        period: 5, // Not in [3, 6, 9, 12]
        interestType: 'simple',
      };

      // Act
      const dto = plainToInstance(CalculateInvestmentDto, invalidData);
      const errors = await validate(dto);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('period');
      expect(errors[0].constraints).toHaveProperty('isIn');
    });

    it('should pass validation for all allowed period values', async () => {
      // Test all valid period values: 3, 6, 9, 12
      const allowedPeriods = [3, 6, 9, 12];

      for (const period of allowedPeriods) {
        // Arrange
        const validData = {
          initialAmount: 10000,
          period,
          interestType: 'simple',
        };

        // Act
        const dto = plainToInstance(CalculateInvestmentDto, validData);
        const errors = await validate(dto);

        // Assert
        expect(errors.length).toBe(0);
      }
    });
  });

  describe('interestType validation', () => {
    it('should fail validation when interestType is missing', async () => {
      // Arrange
      const invalidData = {
        initialAmount: 10000,
        period: 6,
      };

      // Act
      const dto = plainToInstance(CalculateInvestmentDto, invalidData);
      const errors = await validate(dto);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('interestType');
    });

    it('should fail validation when interestType is not one of the allowed values', async () => {
      // Arrange
      const invalidData = {
        initialAmount: 10000,
        period: 6,
        interestType: 'invalid-type', // Not 'simple' or 'compound'
      };

      // Act
      const dto = plainToInstance(CalculateInvestmentDto, invalidData);
      const errors = await validate(dto);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('interestType');
      expect(errors[0].constraints).toHaveProperty('isEnum');
    });

    it('should pass validation for all allowed interestType values', async () => {
      // Test all valid interestType values: 'simple', 'compound'
      const allowedTypes = ['simple', 'compound'];

      for (const interestType of allowedTypes) {
        // Arrange
        const validData = {
          initialAmount: 10000,
          period: 6,
          interestType,
        };

        // Act
        const dto = plainToInstance(CalculateInvestmentDto, validData);
        const errors = await validate(dto);

        // Assert
        expect(errors.length).toBe(0);
      }
    });
  });
});
