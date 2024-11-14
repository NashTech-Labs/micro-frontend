import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  MinLength,
  Matches,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateTenantDto {
  @ApiProperty({ description: 'Name of the tenant' })
  @IsString()
  tenant_name: string;

  @ApiProperty({ description: 'Email of the tenant' })
  @IsEmail()
  tenant_email: string;

  @ApiProperty({
    description: 'Password of the tenant',
    minLength: 6,
    pattern:
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$',
  })
  @IsString()
  @MinLength(6)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
    },
  )
  password: string;

  @ApiProperty({ description: 'Status of the tenant' })
  @IsString()
  status: string;

  @ApiProperty({ description: 'Role of the tenant', required: false })
  @IsOptional()
  @IsString()
  role?: string;
}

export class CreateRegisteredDto {
  @ApiProperty({ description: 'Name of the tenant' })
  @IsString()
  tenant_name: string;

  @ApiProperty({ description: 'Email of the tenant' })
  @IsEmail()
  tenant_email: string;

  @ApiProperty({
    description: 'Password of the tenant',
    minLength: 6,
    pattern:
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$',
  })
  @IsString()
  @MinLength(6)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
    },
  )
  password: string;

  

  @ApiProperty({ description: 'Role of the tenant', required: false })
  @IsOptional()
  @IsString()
  role?: string;
}

export class GetTenantByIdDto {
  @ApiProperty({
    description: 'ID of the tenant',
    type: Number,
  })
  @IsNumber()
  id: number;
}

export class UpdateTenantDto {
  @ApiProperty({ example: 'Tenant Name', required: false })
  @IsOptional()
  @IsString()
  tenant_name?: string;

  @ApiProperty({ example: 'tenant@example.com', required: false })
  @IsOptional()
  @IsEmail()
  tenant_email?: string;

  @ApiProperty({ example: 'active', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: 'admin', required: false })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiProperty({ example: '1234567890', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'New York', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: 'IT', required: false })
  @IsOptional()
  @IsString()
  company_type?: string;

  @ApiProperty({ example: 'image_url', required: false })
  @IsOptional()
  @IsString()
  image?: string;
}

export class DeleteTenantDto {
  @ApiProperty({ description: 'ID of the tenant to delete' })
  @IsNumber()
  id: number;
}
