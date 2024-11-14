import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsNumber } from 'class-validator';

export class CreateEmployeeSkillDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  skill_name: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  employee_id: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  studio_id: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  level: number;
}

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

export class EmployeeSkillIdDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  employee_id: string;
}

export class DeleteEmployeeSkillDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;


}
