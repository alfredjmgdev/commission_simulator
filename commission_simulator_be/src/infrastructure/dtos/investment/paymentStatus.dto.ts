import { ApiProperty } from '@nestjs/swagger';

export class PaymentStatusTimeDto {
  @ApiProperty()
  timeStart: number;

  @ApiProperty()
  timeEnd: number;

  @ApiProperty()
  timeDelta: number;
}

export class PaymentStatusResponseDto {
  @ApiProperty()
  address: string;

  @ApiProperty()
  network: string;

  @ApiProperty()
  fundsGoal: number;

  @ApiProperty()
  smartContractAddress: string;

  @ApiProperty()
  amountCaptured: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  fundStatus: string;

  @ApiProperty()
  processStep: number;

  @ApiProperty()
  processTotalSteps: number;

  @ApiProperty()
  isPaymentReceived: boolean;

  @ApiProperty()
  currentBalance: number;

  @ApiProperty()
  smartContractSymbol: string;

  @ApiProperty()
  fundsExpirationAt: number;

  @ApiProperty({ type: [String] })
  forwardAddresses: string[];
}

export class PaymentStatusResponseDataDto {
  @ApiProperty()
  data: PaymentStatusResponseDto;

  @ApiProperty()
  time: PaymentStatusTimeDto;
}
