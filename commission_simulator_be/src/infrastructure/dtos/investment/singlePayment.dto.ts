import { ApiProperty } from '@nestjs/swagger';

export class SinglePaymentResponseDto {
  @ApiProperty()
  address: string;

  @ApiProperty()
  network: string;

  @ApiProperty()
  fundsGoal: number;

  @ApiProperty()
  smartContractAddress: string;

  @ApiProperty({ type: [String] })
  accounts: string[];
}
