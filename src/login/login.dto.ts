import { ApiProperty } from '@nestjs/swagger';

export class LoginBodys {
  @ApiProperty({
    example: 'test112@gmail.com',
    description: 'Email of the user',
  })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Password of the user' })
  password: string;

  @ApiProperty({ example: 'employee', description: 'Role of the user' })
  role: string;

  @ApiProperty({ example: '8756', description: 'Tenant code' })
  tenant_code: string;
}
