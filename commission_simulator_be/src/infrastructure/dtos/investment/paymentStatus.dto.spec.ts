import { validate } from 'class-validator';
import {
  PaymentStatusResponseDataDto,
  PaymentStatusResponseDto,
  PaymentStatusTimeDto,
} from './paymentStatus.dto';

describe('PaymentStatus DTOs', () => {
  describe('PaymentStatusResponseDataDto', () => {
    it('should be defined', () => {
      const dto = new PaymentStatusResponseDataDto();
      expect(dto).toBeDefined();
    });

    it('should allow setting and getting data and time properties', () => {
      const dto = new PaymentStatusResponseDataDto();
      const statusDto = new PaymentStatusResponseDto();
      const timeDto = new PaymentStatusTimeDto();

      dto.data = statusDto;
      dto.time = timeDto;

      expect(dto.data).toBe(statusDto);
      expect(dto.time).toBe(timeDto);
    });

    it('should accept valid data', async () => {
      const dto = new PaymentStatusResponseDataDto();
      dto.data = new PaymentStatusResponseDto();
      dto.time = new PaymentStatusTimeDto();

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('PaymentStatusResponseDto', () => {
    it('should be defined', () => {
      const dto = new PaymentStatusResponseDto();
      expect(dto).toBeDefined();
    });

    it('should allow setting and getting all required properties', () => {
      const dto = new PaymentStatusResponseDto();

      // Set properties
      dto.address = '0x123456789abcdef';
      dto.network = 'ethereum';
      dto.fundsGoal = 10000;
      dto.smartContractAddress = '0xabcdef123456789';
      dto.amountCaptured = 5000;
      dto.status = 'pending';
      dto.fundStatus = 'partial';
      dto.processStep = 2;
      dto.processTotalSteps = 4;
      dto.isPaymentReceived = true;
      dto.currentBalance = 5000;
      dto.smartContractSymbol = 'ETH';
      dto.fundsExpirationAt = 1672531200000;
      dto.forwardAddresses = ['0xforward1', '0xforward2'];

      // Check properties
      expect(dto.address).toBe('0x123456789abcdef');
      expect(dto.network).toBe('ethereum');
      expect(dto.fundsGoal).toBe(10000);
      expect(dto.smartContractAddress).toBe('0xabcdef123456789');
      expect(dto.amountCaptured).toBe(5000);
      expect(dto.status).toBe('pending');
      expect(dto.fundStatus).toBe('partial');
      expect(dto.processStep).toBe(2);
      expect(dto.processTotalSteps).toBe(4);
      expect(dto.isPaymentReceived).toBe(true);
      expect(dto.currentBalance).toBe(5000);
      expect(dto.smartContractSymbol).toBe('ETH');
      expect(dto.fundsExpirationAt).toBe(1672531200000);
      expect(dto.forwardAddresses).toEqual(['0xforward1', '0xforward2']);
    });

    it('should accept valid data', async () => {
      const dto = new PaymentStatusResponseDto();
      dto.address = '0x123456789abcdef';
      dto.network = 'ethereum';
      dto.fundsGoal = 10000;
      dto.smartContractAddress = '0xabcdef123456789';
      dto.amountCaptured = 5000;
      dto.status = 'pending';
      dto.fundStatus = 'partial';
      dto.processStep = 2;
      dto.processTotalSteps = 4;
      dto.isPaymentReceived = true;
      dto.currentBalance = 5000;
      dto.smartContractSymbol = 'ETH';
      dto.fundsExpirationAt = Date.now() + 86400000; // 24 hours from now
      dto.forwardAddresses = ['0xforward1', '0xforward2'];

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('PaymentStatusTimeDto', () => {
    it('should be defined', () => {
      const dto = new PaymentStatusTimeDto();
      expect(dto).toBeDefined();
    });

    it('should allow setting and getting timeStart, timeEnd, and timeDelta properties', () => {
      const dto = new PaymentStatusTimeDto();

      dto.timeStart = 1672444800000;
      dto.timeEnd = 1672448400000;
      dto.timeDelta = 3600000;

      expect(dto.timeStart).toBe(1672444800000);
      expect(dto.timeEnd).toBe(1672448400000);
      expect(dto.timeDelta).toBe(3600000);
    });

    it('should accept valid data', async () => {
      const dto = new PaymentStatusTimeDto();
      dto.timeStart = Date.now() - 5000; // 5 seconds ago
      dto.timeEnd = Date.now();
      dto.timeDelta = 5000; // 5 seconds

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('Integration between DTOs', () => {
    it('should create a complete payment status response', () => {
      // Create time DTO
      const timeDto = new PaymentStatusTimeDto();
      timeDto.timeStart = 1672444800000; // Jan 1, 2023 00:00:00 UTC
      timeDto.timeEnd = 1672448400000; // Jan 1, 2023 01:00:00 UTC
      timeDto.timeDelta = 3600000; // 1 hour in milliseconds

      // Create payment status DTO
      const statusDto = new PaymentStatusResponseDto();
      statusDto.address = '0x123456789abcdef';
      statusDto.network = 'ethereum';
      statusDto.fundsGoal = 10000;
      statusDto.smartContractAddress = '0xabcdef123456789';
      statusDto.amountCaptured = 5000;
      statusDto.status = 'pending';
      statusDto.fundStatus = 'partial';
      statusDto.processStep = 2;
      statusDto.processTotalSteps = 4;
      statusDto.isPaymentReceived = true;
      statusDto.currentBalance = 5000;
      statusDto.smartContractSymbol = 'ETH';
      statusDto.fundsExpirationAt = 1672531200000; // Jan 1, 2023 23:59:59 UTC
      statusDto.forwardAddresses = ['0xforward1', '0xforward2'];

      // Create response data DTO
      const responseDto = new PaymentStatusResponseDataDto();
      responseDto.data = statusDto;
      responseDto.time = timeDto;

      // Verify the complete structure
      expect(responseDto.data).toBe(statusDto);
      expect(responseDto.time).toBe(timeDto);
      expect(responseDto.data.address).toBe('0x123456789abcdef');
      expect(responseDto.time.timeDelta).toBe(3600000);
    });
  });

  describe('Serialization', () => {
    it('should serialize to JSON correctly', () => {
      // Create a complete payment status response
      const timeDto = new PaymentStatusTimeDto();
      timeDto.timeStart = 1672444800000;
      timeDto.timeEnd = 1672448400000;
      timeDto.timeDelta = 3600000;

      const statusDto = new PaymentStatusResponseDto();
      statusDto.address = '0x123456789abcdef';
      statusDto.network = 'ethereum';
      statusDto.fundsGoal = 10000;
      statusDto.smartContractAddress = '0xabcdef123456789';
      statusDto.amountCaptured = 5000;
      statusDto.status = 'pending';
      statusDto.fundStatus = 'partial';
      statusDto.processStep = 2;
      statusDto.processTotalSteps = 4;
      statusDto.isPaymentReceived = true;
      statusDto.currentBalance = 5000;
      statusDto.smartContractSymbol = 'ETH';
      statusDto.fundsExpirationAt = 1672531200000;
      statusDto.forwardAddresses = ['0xforward1', '0xforward2'];

      const responseDto = new PaymentStatusResponseDataDto();
      responseDto.data = statusDto;
      responseDto.time = timeDto;

      // Serialize to JSON
      const json = JSON.stringify(responseDto);
      const parsed = JSON.parse(json) as PaymentStatusResponseDataDto;

      // Verify the serialized structure
      expect(parsed).toEqual({
        data: {
          address: '0x123456789abcdef',
          network: 'ethereum',
          fundsGoal: 10000,
          smartContractAddress: '0xabcdef123456789',
          amountCaptured: 5000,
          status: 'pending',
          fundStatus: 'partial',
          processStep: 2,
          processTotalSteps: 4,
          isPaymentReceived: true,
          currentBalance: 5000,
          smartContractSymbol: 'ETH',
          fundsExpirationAt: 1672531200000,
          forwardAddresses: ['0xforward1', '0xforward2'],
        },
        time: {
          timeStart: 1672444800000,
          timeEnd: 1672448400000,
          timeDelta: 3600000,
        },
      });
    });
  });
});
