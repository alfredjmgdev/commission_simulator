import { IsNumber, IsEnum, Min, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CalculateInvestmentDto {
  @ApiProperty({
    description: 'Initial investment amount',
    example: 10000,
  })
  @IsNumber()
  @Min(1)
  initialAmount: number;

  @ApiProperty({
    description: 'Investment period in months',
    example: 6,
    enum: [3, 6, 9, 12],
  })
  @IsNumber()
  @IsIn([3, 6, 9, 12])
  period: number;

  @ApiProperty({
    description: 'Type of interest calculation',
    example: 'simple',
    enum: ['simple', 'compound'],
  })
  @IsEnum(['simple', 'compound'])
  interestType: 'simple' | 'compound';
}
