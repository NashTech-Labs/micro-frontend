import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  IsNumberString,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  designation: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  gender: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  studio_name: string;

  @IsString()
  @ApiProperty()
  role: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  location?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  image?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  phone?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @MinLength(6)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
    },
  )
  password: string;
}

export class FilterUsersByNameDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
}

export class FilterUsersByLocationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  location: string;
}

export class GetUserByIdDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  id: number;
}

export class UpdateUserDto {
  @IsOptional()
  @IsNumberString()
  @ApiProperty()
  id: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  first_name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  last_name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  designation?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  role?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  gender?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty()
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  image?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  location?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  marital_status?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  blood_group?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  phy_disable?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  pan_card?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  aadhaar_card?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  uan?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  personal_email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  phone?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  whatsapp?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  wordpress?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  github?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  bitbuket?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  work_phone?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  address?: string;
}

export class updateReportingDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  competency: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  reporting_manager: string;
}

export class checkUsersByEmail {
  @IsEmail()
  @ApiProperty()
  @IsNotEmpty()
  email: string;
}

export class DeleteUserDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  id: number;
}
