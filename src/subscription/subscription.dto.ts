import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsPositive,
  IsOptional,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlanDto {
  @ApiProperty({
    description: 'Name of the plan',
    example: 'Basic Plan',
  })
  @IsString()
  @IsNotEmpty()
  planName: string;

  @ApiProperty({
    description: 'Number of employees included in the plan',
    example: 50,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  numberOfEmployees: number;

  @ApiProperty({
    description: 'Duration of the plan in months',
    example: 12,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  planDuration: number;

  @ApiProperty({
    description: 'Description of the plan',
    example: 'This plan includes basic features for up to 50 employees.',
  })
  @IsString()
  @IsOptional()
  planDescription?: string;

  @ApiProperty({
    description: 'Price of the plan',
    example: 199.99,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Status of the plan',
    example: 'active',
  })
  @IsString()
  @IsNotEmpty()
  status: string;
}

export class GetSubscriptionByIdDto {
  @ApiProperty({
    description: 'ID of the subscription',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id: number;
}

export class UpdateSubscriptionDto {
  @ApiProperty({
    description: 'Name of the plan',
    example: 'Basic Plan',
  })
  @IsString()
  @IsNotEmpty()
  planName: string;

  @ApiProperty({
    description: 'Number of employees included in the plan',
    example: 50,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  numberOfEmployees: number;

  @ApiProperty({
    description: 'Duration of the plan in months',
    example: 12,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  planDuration: number;

  @ApiProperty({
    description: 'Description of the plan',
    example: 'This plan includes basic features for up to 50 employees.',
  })
  @IsString()
  @IsOptional()
  planDescription?: string;

  @ApiProperty({
    description: 'Price of the plan',
    example: 199.99,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Status of the plan',
    example: 'active',
  })
  @IsString()
  @IsNotEmpty()
  status: string;
}

export class DeleteSubscriptionDto {
  @ApiProperty({
    description: 'ID of the subscription',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id: number;
}

export class SubscriptionNameDto {
  @ApiProperty({
    description: 'Plane Name',
    example: 1,
  })
  @IsString()
  @IsNotEmpty()
  planName: string;
}
