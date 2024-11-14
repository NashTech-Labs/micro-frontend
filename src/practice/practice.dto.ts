import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePracticeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  total_employee: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  studio_head: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  location: string;
}

export class PracticeNameDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;
}

export class UpdatePracticeDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  total_employee: number;

  @ApiProperty()
  @IsString()
  studio_head: string;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty()
  @IsString()
  location: string;
}

export class PracticeGetIdDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;
}

export class PracticeDeleteIdDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
