import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsNumber } from 'class-validator';


export class EmployeeSkillNameDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  skill_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  employee_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  level: string;
}

export class EmployeeBySkillDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  skill_name: string;
}


export class EmployeeByStudioDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  studio_id: string;
}


export class EmployeeByLevelDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  skill_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  level: string;
}

