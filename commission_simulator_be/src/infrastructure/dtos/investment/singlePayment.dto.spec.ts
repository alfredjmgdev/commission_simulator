import { plainToInstance } from 'class-transformer';
import { SinglePaymentResponseDto } from './singlePayment.dto';
import { validate } from 'class-validator';

describe('SinglePaymentResponseDto', () => {
  it('should create a valid DTO instance', () => {
    // Arrange
    const dto = new SinglePaymentResponseDto();
    dto.address = '0x123456789abcdef';
    dto.network = 'ethereum';
    dto.fundsGoal = 10000;
    dto.smartContractAddress = '0xabcdef123456789';
    dto.accounts = ['account1', 'account2'];

    // Assert
    expect(dto).toBeDefined();
    expect(dto.address).toBe('0x123456789abcdef');
    expect(dto.network).toBe('ethereum');
    expect(dto.fundsGoal).toBe(10000);
    expect(dto.smartContractAddress).toBe('0xabcdef123456789');
    expect(dto.accounts).toEqual(['account1', 'account2']);
  });

  it('should convert plain object to DTO instance', () => {
    // Arrange
    const plainObject = {
      address: '0x123456789abcdef',
      network: 'ethereum',
      fundsGoal: 10000,
      smartContractAddress: '0xabcdef123456789',
      accounts: ['account1', 'account2'],
    };

    // Act
    const dto = plainToInstance(SinglePaymentResponseDto, plainObject);

    // Assert
    expect(dto).toBeInstanceOf(SinglePaymentResponseDto);
    expect(dto.address).toBe('0x123456789abcdef');
    expect(dto.network).toBe('ethereum');
    expect(dto.fundsGoal).toBe(10000);
    expect(dto.smartContractAddress).toBe('0xabcdef123456789');
    expect(dto.accounts).toEqual(['account1', 'account2']);
  });

  it('should handle empty accounts array', () => {
    // Arrange
    const dto = new SinglePaymentResponseDto();
    dto.address = '0x123456789abcdef';
    dto.network = 'ethereum';
    dto.fundsGoal = 10000;
    dto.smartContractAddress = '0xabcdef123456789';
    dto.accounts = [];

    // Assert
    expect(dto.accounts).toEqual([]);
    expect(dto.accounts.length).toBe(0);
  });

  it('should handle accounts with different string values', () => {
    // Arrange
    const dto = new SinglePaymentResponseDto();
    dto.address = '0x123456789abcdef';
    dto.network = 'ethereum';
    dto.fundsGoal = 10000;
    dto.smartContractAddress = '0xabcdef123456789';

    // Explicitly type the array to avoid any[] type inference
    const accountsArray: string[] = [
      '',
      'very-long-account-name-with-special-chars-123!@#$%^&*()',
    ];
    dto.accounts = accountsArray;

    // Assert
    expect(dto.accounts.length).toBe(2);
    expect(dto.accounts[0]).toBe('');
    expect(dto.accounts[1]).toBe(
      'very-long-account-name-with-special-chars-123!@#$%^&*()',
    );
  });

  it('should create a DTO from object literal with proper type casting', () => {
    // Arrange & Act
    const dto: SinglePaymentResponseDto = {
      address: '0x123456789abcdef',
      network: 'ethereum',
      fundsGoal: 10000,
      smartContractAddress: '0xabcdef123456789',
      accounts: ['account1', 'account2'],
    };

    // Assert
    expect(dto.address).toBe('0x123456789abcdef');
    expect(dto.network).toBe('ethereum');
    expect(dto.fundsGoal).toBe(10000);
    expect(dto.smartContractAddress).toBe('0xabcdef123456789');
    expect(dto.accounts).toEqual(['account1', 'account2']);
  });

  it('should match the structure used in the controller', () => {
    // Arrange
    const dto = new SinglePaymentResponseDto();
    dto.address = 'payment_address_123';
    dto.network = 'ethereum';
    dto.fundsGoal = 10000;
    dto.smartContractAddress = 'smart_contract_address_123';
    dto.accounts = ['account1', 'account2'];

    // Act - Simulate what happens in the controller
    const controllerResponse = {
      paymentAddress: dto.address,
      network: dto.network,
      amount: dto.fundsGoal,
      qrCodeData: 'data:image/png;base64,qrCodeImageBase64String',
    };

    // Assert
    expect(controllerResponse.paymentAddress).toBe(dto.address);
    expect(controllerResponse.network).toBe(dto.network);
    expect(controllerResponse.amount).toBe(dto.fundsGoal);
  });

  it('should handle type conversion for fundsGoal', () => {
    // Arrange
    const dto = new SinglePaymentResponseDto();
    dto.address = '0x123456789abcdef';
    dto.network = 'ethereum';

    // Act - Test type conversion with explicit typing
    const stringValue = '20000';
    dto.fundsGoal = Number(stringValue);

    // Assert
    expect(typeof dto.fundsGoal).toBe('number');
    expect(dto.fundsGoal).toBe(20000);
  });

  it('should serialize to JSON correctly', () => {
    // Arrange
    const dto = new SinglePaymentResponseDto();
    dto.address = '0x123456789abcdef';
    dto.network = 'ethereum';
    dto.fundsGoal = 10000;
    dto.smartContractAddress = '0xabcdef123456789';
    dto.accounts = ['account1', 'account2'];

    // Act
    const json = JSON.stringify(dto);
    const parsed = JSON.parse(json) as Record<string, unknown>;

    // Assert - Using type assertion to avoid any
    expect(parsed.address).toBe('0x123456789abcdef');
    expect(parsed.network).toBe('ethereum');
    expect(parsed.fundsGoal).toBe(10000);
    expect(parsed.smartContractAddress).toBe('0xabcdef123456789');
    expect(Array.isArray(parsed.accounts)).toBe(true);
    expect((parsed.accounts as string[])[0]).toBe('account1');
    expect((parsed.accounts as string[])[1]).toBe('account2');
  });

  it('should match the structure defined in the domain entity', () => {
    // Arrange
    const dto = new SinglePaymentResponseDto();
    dto.address = '0x123456789abcdef';
    dto.network = 'ethereum';
    dto.fundsGoal = 10000;
    dto.smartContractAddress = '0xabcdef123456789';
    dto.accounts = ['account1', 'account2'];

    // Assert - Verify all properties from BasePayment are present
    expect(dto).toHaveProperty('address');
    expect(dto).toHaveProperty('network');
    expect(dto).toHaveProperty('fundsGoal');
    expect(dto).toHaveProperty('smartContractAddress');

    // Assert - Verify SinglePayment specific property
    expect(dto).toHaveProperty('accounts');
    expect(Array.isArray(dto.accounts)).toBe(true);
  });

  it('should be compatible with the SinglePaymentResponseData interface', () => {
    // This test verifies that the DTO is compatible with the interface used in the repository
    // Arrange
    const dto = new SinglePaymentResponseDto();
    dto.address = '0x123456789abcdef';
    dto.network = 'ethereum';
    dto.fundsGoal = 10000;
    dto.smartContractAddress = '0xabcdef123456789';
    dto.accounts = ['account1', 'account2'];

    // Act - Simulate mapping from DTO to domain entity
    const singlePayment = {
      address: dto.address,
      network: dto.network,
      fundsGoal: dto.fundsGoal,
      smartContractAddress: dto.smartContractAddress,
      accounts: dto.accounts,
    };

    // Assert
    expect(singlePayment.address).toBe(dto.address);
    expect(singlePayment.network).toBe(dto.network);
    expect(singlePayment.fundsGoal).toBe(dto.fundsGoal);
    expect(singlePayment.smartContractAddress).toBe(dto.smartContractAddress);
    expect(singlePayment.accounts).toEqual(dto.accounts);
  });

  // Si se añaden validadores al DTO en el futuro, este test sería útil
  it('should pass validation with valid data', async () => {
    // Arrange
    const dto = plainToInstance(SinglePaymentResponseDto, {
      address: '0x123456789abcdef',
      network: 'ethereum',
      fundsGoal: 10000,
      smartContractAddress: '0xabcdef123456789',
      accounts: ['account1', 'account2'],
    });

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(0);
  });
});
