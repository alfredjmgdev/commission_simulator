import { validate } from 'class-validator';
import { GeneratePaymentDto } from './generatePayment.dto';
import { plainToInstance } from 'class-transformer';

describe('GeneratePaymentDto', () => {
  it('should validate a valid DTO', async () => {
    // Arrange
    const dto = plainToInstance(GeneratePaymentDto, {
      amount: 10000,
    });

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(0);
  });

  it('should fail validation when amount is missing', async () => {
    // Arrange
    const dto = plainToInstance(GeneratePaymentDto, {});

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('amount');
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });

  it('should fail validation when amount is not a number', async () => {
    // Arrange
    const dto = plainToInstance(GeneratePaymentDto, {
      amount: 'not-a-number',
    });

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('amount');
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });

  it('should fail validation when amount is less than 1', async () => {
    // Arrange
    const dto = plainToInstance(GeneratePaymentDto, {
      amount: 0,
    });

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('amount');
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should fail validation when amount is negative', async () => {
    // Arrange
    const dto = plainToInstance(GeneratePaymentDto, {
      amount: -100,
    });

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('amount');
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should accept decimal amounts', async () => {
    // Arrange
    const dto = plainToInstance(GeneratePaymentDto, {
      amount: 100.5,
    });

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(0);
  });

  it('should accept large amounts', async () => {
    // Arrange
    const dto = plainToInstance(GeneratePaymentDto, {
      amount: 1000000,
    });

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(0);
  });
});
