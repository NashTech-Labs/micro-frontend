import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsArray,
  IsDate,
  IsDateString,
} from 'class-validator';
import { optional } from 'joi';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  timeline: string;

  @ApiProperty()
  @IsString()
  duration: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty()
  @IsDateString()
  start_date?: Date;

  @ApiProperty()
  @IsDateString()
  end_date?: Date;

  @ApiProperty({ type: [Object] })
  project_team: { employee_id: string, role: string, billable:string, billable_percentage : number }[];

  @ApiProperty({ type: 'string', format: 'binary', description: 'File upload' })
file: any;

  


}

export class ProjectNameDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  competency_name: string;
}

export class UpdateProjectDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  timeline: string;

  @ApiProperty()
  @IsString()
  duration: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty()
  @IsDateString()
  start_date?: Date;

  @ApiProperty()
  @IsDateString()
  end_date?: Date;

  @ApiProperty({ type: [Object] })
  project_team: { employee_id: string, role: string, billable:string, billable_percentage : number }[];

  @ApiProperty({ type: 'string', format: 'binary', description: 'File upload' })
file: any;
}

export class ProjectIdDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class DeleteProjectDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
