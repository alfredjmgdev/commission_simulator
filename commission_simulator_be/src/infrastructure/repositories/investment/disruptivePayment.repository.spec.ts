import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { AxiosResponse, AxiosError } from 'axios';
import { DisruptivePaymentRepository } from './disruptivePayment.repository';
import {
  SinglePayment,
  PaymentStatusResponseData,
} from '../../../domain/entities/investment/payment.entity';

describe('DisruptivePaymentRepository', () => {
  let repository: DisruptivePaymentRepository;
  let httpService: HttpService;
  let configService: ConfigService;

  // Mock environment variables
  const mockEnvVars = {
    DISRUPTIVE_PAYMENT_API_URL: 'https://api.test.com',
    DISRUPTIVE_PAYMENT_API_KEY: 'test-api-key',
    DISRUPTIVE_PAYMENT_SMART_CONTRACT_ADDRESS: '0xtest-contract-address',
    DISRUPTIVE_PAYMENT_NETWORK: 'test-network',
  };

  // Mock response data
  const mockSinglePaymentResponse: AxiosResponse = {
    data: {
      data: {
        address: 'test-address',
        network: 'test-network',
        fundsGoal: 1000,
        smartContractAddress: '0xtest-contract-address',
        accounts: ['account1', 'account2'],
      },
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: { headers: {} } as any,
  };

  const mockPaymentStatusResponse: AxiosResponse = {
    data: {
      data: {
        address: 'test-address',
        network: 'test-network',
        fundsGoal: 1000,
        smartContractAddress: '0xtest-contract-address',
        forwardAddresses: ['forward1', 'forward2'],
        amountCaptured: 500,
        status: 'pending',
        fundStatus: 'partial',
        processStep: 2,
        processTotalSteps: 4,
        currentBalance: 500,
        smartContractSymbol: 'USDT',
        fundsExpirationAt: 1672531200000,
        isPaymentReceived: false,
      },
      timeStart: 1672444800000,
      timeEnd: 1672448400000,
      timeDelta: 3600000,
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: { headers: {} } as any,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DisruptivePaymentRepository,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: keyof typeof mockEnvVars) => mockEnvVars[key]),
          },
        },
      ],
    }).compile();

    repository = module.get<DisruptivePaymentRepository>(
      DisruptivePaymentRepository,
    );
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('constructor', () => {
    it('should throw an error if required environment variables are not set', () => {
      // Mock configService to return undefined for a required env var
      jest.spyOn(configService, 'get').mockReturnValueOnce(undefined);

      // Act & Assert
      expect(() => {
        new DisruptivePaymentRepository(httpService, configService);
      }).toThrow(
        'Environment variable DISRUPTIVE_PAYMENT_API_URL is required but not set',
      );
    });
  });

  describe('createSinglePayment', () => {
    it('should create a single payment successfully', async () => {
      // Arrange
      const amount = 1000;
      jest
        .spyOn(httpService, 'post')
        .mockReturnValueOnce(of(mockSinglePaymentResponse));

      // Act
      const result = await repository.createSinglePayment(amount);

      // Assert
      expect(httpService.post).toHaveBeenCalledWith(
        `${mockEnvVars.DISRUPTIVE_PAYMENT_API_URL}/payments/single`,
        {
          network: mockEnvVars.DISRUPTIVE_PAYMENT_NETWORK,
          fundsGoal: amount,
          smartContractAddress:
            mockEnvVars.DISRUPTIVE_PAYMENT_SMART_CONTRACT_ADDRESS,
        },
        {
          headers: {
            'content-type': 'application/json',
            'client-api-key': mockEnvVars.DISRUPTIVE_PAYMENT_API_KEY,
          },
        },
      );
      expect(result).toBeInstanceOf(SinglePayment);
      expect(result.address).toBe('test-address');
      expect(result.network).toBe('test-network');
      expect(result.fundsGoal).toBe(1000);
      expect(result.smartContractAddress).toBe('0xtest-contract-address');
      expect(result.accounts).toEqual(['account1', 'account2']);
    });

    it('should throw HttpException for non-200 response', async () => {
      // Arrange
      const amount = 1000;
      const errorResponse: AxiosResponse = {
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: { headers: {} } as any,
        data: {
          data: {
            address: 'test-address',
            network: 'test-network',
            fundsGoal: 1000,
            smartContractAddress: '0xtest-contract-address',
            accounts: ['account1', 'account2'],
          },
        },
      };
      jest.spyOn(httpService, 'post').mockReturnValueOnce(of(errorResponse));

      // Act & Assert
      await expect(repository.createSinglePayment(amount)).rejects.toThrow(
        new HttpException(
          'Failed to get payment status: La API de pagos respondió con estado 400',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should handle Axios errors with response', async () => {
      // Arrange
      const amount = 1000;
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 403,
          data: {
            errorMessage: 'Forbidden',
          },
        },
        message: 'Request failed with status code 403',
      } as AxiosError;
      jest
        .spyOn(httpService, 'post')
        .mockReturnValueOnce(throwError(() => axiosError));

      // Act & Assert
      await expect(repository.createSinglePayment(amount)).rejects.toThrow(
        new HttpException(
          'Failed to get payment status: Forbidden',
          HttpStatus.FORBIDDEN,
        ),
      );
    });

    it('should handle Axios errors without response', async () => {
      // Arrange
      const amount = 1000;
      const axiosError = {
        isAxiosError: true,
        message: 'Network Error',
      } as AxiosError;
      jest
        .spyOn(httpService, 'post')
        .mockReturnValueOnce(throwError(() => axiosError));

      // Act & Assert
      await expect(repository.createSinglePayment(amount)).rejects.toThrow(
        new HttpException(
          'Failed to get payment status: Network Error',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should handle generic errors', async () => {
      // Arrange
      const amount = 1000;
      const genericError = new Error('Generic error');
      jest
        .spyOn(httpService, 'post')
        .mockReturnValueOnce(throwError(() => genericError));

      // Act & Assert
      await expect(repository.createSinglePayment(amount)).rejects.toThrow(
        new HttpException(
          'Failed to get payment status: Generic error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('getPaymentStatus', () => {
    it('should get payment status successfully', async () => {
      // Arrange
      const address = 'test-address';
      const mockPaymentStatusResponse: AxiosResponse = {
        data: {
          data: {
            address: 'test-address',
            network: 'test-network',
            fundsGoal: 1000,
            smartContractAddress: '0xtest-contract-address',
            forwardAddresses: ['forward1', 'forward2'],
            amountCaptured: 500,
            status: 'pending',
            fundStatus: 'partial',
            processStep: 2,
            processTotalSteps: 4,
            currentBalance: 500,
            smartContractSymbol: 'USDT',
            fundsExpirationAt: 1672531200000,
          },
          timeStart: 1672444800000,
          timeEnd: 1672448400000,
          timeDelta: 3600000,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} } as any,
      };
      jest
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(of(mockPaymentStatusResponse));

      // Act
      const result = await repository.getPaymentStatus(address);

      // Assert
      expect(result).toBeInstanceOf(PaymentStatusResponseData);
      expect(result.data.address).toBe('test-address');
      expect(result.data.network).toBe('test-network');
      expect(result.data.fundsGoal).toBe(1000);
      expect(result.data.smartContractAddress).toBe('0xtest-contract-address');
      expect(result.data.forwardAddresses).toEqual(['forward1', 'forward2']);
      expect(result.data.amountCaptured).toBe(500);
      expect(result.data.status).toBe('pending');
      expect(result.data.fundStatus).toBe('partial');
      expect(result.data.processStep).toBe(2);
      expect(result.data.processTotalSteps).toBe(4);
      expect(result.data.currentBalance).toBe(500);
      expect(result.data.smartContractSymbol).toBe('USDT');
      expect(result.data.fundsExpirationAt).toBe(1672531200000);
      expect(result.data.isPaymentReceived).toBe(true);
      expect(result.time.timeStart).toBe(1672444800000);
      expect(result.time.timeEnd).toBe(1672448400000);
      expect(result.time.timeDelta).toBe(3600000);
    });

    it('should throw HttpException for non-200 response', async () => {
      // Arrange
      const address = 'test-address';
      const errorResponse: AxiosResponse = {
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: { headers: {} } as any,
        data: {
          data: {
            address: 'test-address',
            network: 'test-network',
            fundsGoal: 1000,
            smartContractAddress: '0xtest-contract-address',
            forwardAddresses: ['forward1', 'forward2'],
            amountCaptured: 500,
            status: 'pending',
            fundStatus: 'partial',
            processStep: 2,
            processTotalSteps: 4,
            currentBalance: 500,
            smartContractSymbol: 'USDT',
            fundsExpirationAt: 1672531200000,
          },
          timeStart: 1672444800000,
          timeEnd: 1672448400000,
          timeDelta: 3600000,
        },
      };
      jest.spyOn(httpService, 'get').mockReturnValueOnce(of(errorResponse));

      // Act & Assert
      await expect(repository.getPaymentStatus(address)).rejects.toThrow(
        new HttpException(
          'Failed to get payment status: La API de pagos respondió con estado 404',
          HttpStatus.NOT_FOUND,
        ),
      );
    });

    it('should handle Axios errors with response', async () => {
      // Arrange
      const address = 'test-address';
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 403,
          data: {
            errorMessage: 'Forbidden',
          },
        },
        message: 'Request failed with status code 403',
      } as AxiosError;
      jest
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(throwError(() => axiosError));

      // Act & Assert
      await expect(repository.getPaymentStatus(address)).rejects.toThrow(
        new HttpException(
          'Failed to get payment status: Forbidden',
          HttpStatus.FORBIDDEN,
        ),
      );
    });

    it('should handle Axios errors without response', async () => {
      // Arrange
      const address = 'test-address';
      const axiosError = {
        isAxiosError: true,
        message: 'Network Error',
      } as AxiosError;
      jest
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(throwError(() => axiosError));

      // Act & Assert
      await expect(repository.getPaymentStatus(address)).rejects.toThrow(
        new HttpException(
          'Failed to get payment status: Network Error',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should handle generic errors', async () => {
      // Arrange
      const address = 'test-address';
      const genericError = new Error('Generic error');
      jest
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(throwError(() => genericError));

      // Act & Assert
      await expect(repository.getPaymentStatus(address)).rejects.toThrow(
        new HttpException(
          'Failed to get payment status: Generic error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });

    it('should handle missing optional fields in response', async () => {
      // Arrange
      const address = 'test-address';
      const incompleteResponse: AxiosResponse = {
        data: {
          data: {
            address: 'test-address',
            network: 'test-network',
            fundsGoal: 1000,
            smartContractAddress: '0xtest-contract-address',
            // Missing optional fields
          },
          timeStart: 1672444800000,
          timeEnd: 1672448400000,
          timeDelta: 3600000,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} } as any,
      };
      jest
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(of(incompleteResponse));

      // Act
      const result = await repository.getPaymentStatus(address);

      // Assert
      expect(result).toBeInstanceOf(PaymentStatusResponseData);
      expect(result.data.address).toBe('test-address');
      expect(result.data.forwardAddresses).toEqual([]);
      expect(result.data.amountCaptured).toBe(0);
      expect(result.data.status).toBe('');
      expect(result.data.fundStatus).toBe('');
      expect(result.data.processStep).toBe(0);
      expect(result.data.processTotalSteps).toBe(0);
      expect(result.data.currentBalance).toBe(0);
      expect(result.data.smartContractSymbol).toBe('');
      expect(result.data.fundsExpirationAt).toBe(0);
      expect(result.data.isPaymentReceived).toBe(false);
    });
  });
});
