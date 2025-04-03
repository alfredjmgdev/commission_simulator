import {
  BasePayment,
  SinglePayment,
  PaymentStatus,
  PaymentStatusTime,
  PaymentStatusResponseData,
} from './payment.entity';

describe('Payment Entities', () => {
  describe('BasePayment', () => {
    it('should create a BasePayment instance with correct properties', () => {
      // Arrange
      const address = 'test-address';
      const network = 'test-network';
      const fundsGoal = 1000;
      const smartContractAddress = 'test-contract-address';

      // Act
      const basePayment = new BasePayment(
        address,
        network,
        fundsGoal,
        smartContractAddress,
      );

      // Assert
      expect(basePayment).toBeDefined();
      expect(basePayment.address).toBe(address);
      expect(basePayment.network).toBe(network);
      expect(basePayment.fundsGoal).toBe(fundsGoal);
      expect(basePayment.smartContractAddress).toBe(smartContractAddress);
    });

    it('should handle numeric values correctly', () => {
      // Arrange
      const address = 'test-address';
      const network = 'test-network';
      const fundsGoal = 1234.56;
      const smartContractAddress = 'test-contract-address';

      // Act
      const basePayment = new BasePayment(
        address,
        network,
        fundsGoal,
        smartContractAddress,
      );

      // Assert
      expect(basePayment.fundsGoal).toBe(1234.56);
      expect(typeof basePayment.fundsGoal).toBe('number');
    });
  });

  describe('SinglePayment', () => {
    it('should create a SinglePayment instance with correct properties', () => {
      // Arrange
      const address = 'test-address';
      const network = 'test-network';
      const fundsGoal = 1000;
      const smartContractAddress = 'test-contract-address';
      const accounts: string[] = ['account1', 'account2'];

      // Act
      const singlePayment = new SinglePayment(
        address,
        network,
        fundsGoal,
        smartContractAddress,
        accounts,
      );

      // Assert
      expect(singlePayment).toBeDefined();
      expect(singlePayment.address).toBe(address);
      expect(singlePayment.network).toBe(network);
      expect(singlePayment.fundsGoal).toBe(fundsGoal);
      expect(singlePayment.smartContractAddress).toBe(smartContractAddress);
      expect(singlePayment.accounts).toEqual(accounts);
    });

    it('should inherit from BasePayment', () => {
      // Arrange
      const address = 'test-address';
      const network = 'test-network';
      const fundsGoal = 1000;
      const smartContractAddress = 'test-contract-address';
      const accounts: string[] = ['account1', 'account2'];

      // Act
      const singlePayment = new SinglePayment(
        address,
        network,
        fundsGoal,
        smartContractAddress,
        accounts,
      );

      // Assert
      expect(singlePayment).toBeInstanceOf(BasePayment);
    });

    it('should handle empty accounts array', () => {
      // Arrange
      const address = 'test-address';
      const network = 'test-network';
      const fundsGoal = 1000;
      const smartContractAddress = 'test-contract-address';
      const accounts: string[] = [];

      // Act
      const singlePayment = new SinglePayment(
        address,
        network,
        fundsGoal,
        smartContractAddress,
        accounts,
      );

      // Assert
      expect(singlePayment.accounts).toEqual([]);
      expect(singlePayment.accounts.length).toBe(0);
    });

    it('should handle accounts with different string values', () => {
      // Arrange
      const address = 'test-address';
      const network = 'test-network';
      const fundsGoal = 1000;
      const smartContractAddress = 'test-contract-address';
      const accounts: string[] = [
        '',
        'very-long-account-name-with-special-chars-123!@#$%^&*()',
      ];

      // Act
      const singlePayment = new SinglePayment(
        address,
        network,
        fundsGoal,
        smartContractAddress,
        accounts,
      );

      // Assert
      expect(singlePayment.accounts.length).toBe(2);
      expect(singlePayment.accounts[0]).toBe('');
      expect(singlePayment.accounts[1]).toBe(
        'very-long-account-name-with-special-chars-123!@#$%^&*()',
      );
    });
  });

  describe('PaymentStatus', () => {
    // Define common test values
    const address = 'test-address';
    const network = 'test-network';
    const fundsGoal = 1000;
    const smartContractAddress = 'test-contract-address';
    const forwardAddresses: string[] = ['forward1', 'forward2'];
    const amountCaptured = 500;
    const status = 'pending';
    const fundStatus = 'partial';
    const processStep = 2;
    const processTotalSteps = 4;
    const currentBalance = 500;
    const smartContractSymbol = 'USDT';
    const fundsExpirationAt = 1672531200000;
    const isPaymentReceived = true;

    it('should create a PaymentStatus instance with correct properties', () => {
      // Act
      const paymentStatus = new PaymentStatus(
        address,
        network,
        fundsGoal,
        smartContractAddress,
        forwardAddresses,
        amountCaptured,
        status,
        fundStatus,
        processStep,
        processTotalSteps,
        currentBalance,
        smartContractSymbol,
        fundsExpirationAt,
        isPaymentReceived,
      );

      // Assert
      expect(paymentStatus).toBeDefined();
      expect(paymentStatus.address).toBe(address);
      expect(paymentStatus.network).toBe(network);
      expect(paymentStatus.fundsGoal).toBe(fundsGoal);
      expect(paymentStatus.smartContractAddress).toBe(smartContractAddress);
      expect(paymentStatus.forwardAddresses).toEqual(forwardAddresses);
      expect(paymentStatus.amountCaptured).toBe(amountCaptured);
      expect(paymentStatus.status).toBe(status);
      expect(paymentStatus.fundStatus).toBe(fundStatus);
      expect(paymentStatus.processStep).toBe(processStep);
      expect(paymentStatus.processTotalSteps).toBe(processTotalSteps);
      expect(paymentStatus.currentBalance).toBe(currentBalance);
      expect(paymentStatus.smartContractSymbol).toBe(smartContractSymbol);
      expect(paymentStatus.fundsExpirationAt).toBe(fundsExpirationAt);
      expect(paymentStatus.isPaymentReceived).toBe(isPaymentReceived);
    });

    it('should inherit from BasePayment', () => {
      // Act
      const paymentStatus = new PaymentStatus(
        address,
        network,
        fundsGoal,
        smartContractAddress,
        forwardAddresses,
        amountCaptured,
        status,
        fundStatus,
        processStep,
        processTotalSteps,
        currentBalance,
        smartContractSymbol,
        fundsExpirationAt,
        isPaymentReceived,
      );

      // Assert
      expect(paymentStatus).toBeInstanceOf(BasePayment);
    });

    it('should handle empty forwardAddresses array', () => {
      // Act
      const paymentStatus = new PaymentStatus(
        address,
        network,
        fundsGoal,
        smartContractAddress,
        [],
        amountCaptured,
        status,
        fundStatus,
        processStep,
        processTotalSteps,
        currentBalance,
        smartContractSymbol,
        fundsExpirationAt,
        isPaymentReceived,
      );

      // Assert
      expect(paymentStatus.forwardAddresses).toEqual([]);
      expect(paymentStatus.forwardAddresses.length).toBe(0);
    });

    it('should handle boolean isPaymentReceived correctly', () => {
      // Act - Test with true
      const paymentStatusTrue = new PaymentStatus(
        address,
        network,
        fundsGoal,
        smartContractAddress,
        forwardAddresses,
        amountCaptured,
        status,
        fundStatus,
        processStep,
        processTotalSteps,
        currentBalance,
        smartContractSymbol,
        fundsExpirationAt,
        true,
      );

      // Act - Test with false
      const paymentStatusFalse = new PaymentStatus(
        address,
        network,
        fundsGoal,
        smartContractAddress,
        forwardAddresses,
        amountCaptured,
        status,
        fundStatus,
        processStep,
        processTotalSteps,
        currentBalance,
        smartContractSymbol,
        fundsExpirationAt,
        false,
      );

      // Assert
      expect(paymentStatusTrue.isPaymentReceived).toBe(true);
      expect(paymentStatusFalse.isPaymentReceived).toBe(false);
      expect(typeof paymentStatusTrue.isPaymentReceived).toBe('boolean');
    });
  });

  describe('PaymentStatusTime', () => {
    it('should create a PaymentStatusTime instance with correct properties', () => {
      // Arrange
      const timeStart = 1672444800000;
      const timeEnd = 1672448400000;
      const timeDelta = 3600000;

      // Act
      const paymentStatusTime = new PaymentStatusTime(
        timeStart,
        timeEnd,
        timeDelta,
      );

      // Assert
      expect(paymentStatusTime).toBeDefined();
      expect(paymentStatusTime.timeStart).toBe(timeStart);
      expect(paymentStatusTime.timeEnd).toBe(timeEnd);
      expect(paymentStatusTime.timeDelta).toBe(timeDelta);
    });

    it('should handle timestamp values correctly', () => {
      // Arrange
      const timeStart = 1672444800000; // 2022-12-31T00:00:00.000Z
      const timeEnd = 1672448400000; // 2022-12-31T01:00:00.000Z
      const timeDelta = 3600000; // 1 hour in milliseconds

      // Act
      const paymentStatusTime = new PaymentStatusTime(
        timeStart,
        timeEnd,
        timeDelta,
      );

      // Assert
      expect(paymentStatusTime.timeStart).toBe(timeStart);
      expect(paymentStatusTime.timeEnd).toBe(timeEnd);
      expect(paymentStatusTime.timeDelta).toBe(timeDelta);
      expect(paymentStatusTime.timeEnd - paymentStatusTime.timeStart).toBe(
        timeDelta,
      );
    });

    it('should handle zero values', () => {
      // Arrange
      const timeStart = 0;
      const timeEnd = 0;
      const timeDelta = 0;

      // Act
      const paymentStatusTime = new PaymentStatusTime(
        timeStart,
        timeEnd,
        timeDelta,
      );

      // Assert
      expect(paymentStatusTime.timeStart).toBe(0);
      expect(paymentStatusTime.timeEnd).toBe(0);
      expect(paymentStatusTime.timeDelta).toBe(0);
    });
  });

  describe('PaymentStatusResponseData', () => {
    it('should create a PaymentStatusResponseData instance with correct properties', () => {
      // Arrange
      const paymentStatus = new PaymentStatus(
        'test-address',
        'test-network',
        1000,
        'test-contract-address',
        ['forward1', 'forward2'],
        500,
        'pending',
        'partial',
        2,
        4,
        500,
        'USDT',
        1672531200000,
        true,
      );

      const paymentStatusTime = new PaymentStatusTime(
        1672444800000,
        1672448400000,
        3600000,
      );

      // Act
      const paymentStatusResponseData = new PaymentStatusResponseData(
        paymentStatus,
        paymentStatusTime,
      );

      // Assert
      expect(paymentStatusResponseData).toBeDefined();
      expect(paymentStatusResponseData.data).toBe(paymentStatus);
      expect(paymentStatusResponseData.time).toBe(paymentStatusTime);
    });

    it('should maintain references to the original objects', () => {
      // Arrange
      const paymentStatus = new PaymentStatus(
        'test-address',
        'test-network',
        1000,
        'test-contract-address',
        ['forward1', 'forward2'],
        500,
        'pending',
        'partial',
        2,
        4,
        500,
        'USDT',
        1672531200000,
        true,
      );

      const paymentStatusTime = new PaymentStatusTime(
        1672444800000,
        1672448400000,
        3600000,
      );

      // Act
      const paymentStatusResponseData = new PaymentStatusResponseData(
        paymentStatus,
        paymentStatusTime,
      );

      // Assert - Check that we can access nested properties
      expect(paymentStatusResponseData.data.address).toBe('test-address');
      expect(paymentStatusResponseData.data.network).toBe('test-network');
      expect(paymentStatusResponseData.data.fundsGoal).toBe(1000);
      expect(paymentStatusResponseData.data.isPaymentReceived).toBe(true);
      expect(paymentStatusResponseData.time.timeStart).toBe(1672444800000);
      expect(paymentStatusResponseData.time.timeEnd).toBe(1672448400000);
      expect(paymentStatusResponseData.time.timeDelta).toBe(3600000);
    });

    it('should serialize to JSON correctly', () => {
      // Arrange
      const paymentStatus = new PaymentStatus(
        'test-address',
        'test-network',
        1000,
        'test-contract-address',
        ['forward1', 'forward2'],
        500,
        'pending',
        'partial',
        2,
        4,
        500,
        'USDT',
        1672531200000,
        true,
      );

      const paymentStatusTime = new PaymentStatusTime(
        1672444800000,
        1672448400000,
        3600000,
      );

      const paymentStatusResponseData = new PaymentStatusResponseData(
        paymentStatus,
        paymentStatusTime,
      );

      // Act
      const json = JSON.stringify(paymentStatusResponseData);
      const parsed = JSON.parse(json);

      // Assert
      expect(parsed).toHaveProperty('data');
      expect(parsed).toHaveProperty('time');
      expect(parsed.data.address).toBe('test-address');
      expect(parsed.data.network).toBe('test-network');
      expect(parsed.data.fundsGoal).toBe(1000);
      expect(parsed.data.forwardAddresses).toEqual(['forward1', 'forward2']);
      expect(parsed.time.timeStart).toBe(1672444800000);
      expect(parsed.time.timeEnd).toBe(1672448400000);
      expect(parsed.time.timeDelta).toBe(3600000);
    });
  });
});
