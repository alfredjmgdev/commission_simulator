import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GeneratePaymentDto {
  @ApiProperty({
    description: 'Amount to pay',
    example: 10000,
  })
  @IsNumber()
  @Min(1)
  amount: number;
}
