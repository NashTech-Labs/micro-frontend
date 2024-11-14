import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsNumber } from 'class-validator';

export class CreateCompetencyDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    competency_name: string; 

    @ApiProperty()
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    competency_admin_email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    status: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    total_project: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    total_employee: number;

    @ApiProperty()
    @IsNumber()
    competency_head: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;
}

export class CompetencyNameDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    competency_name: string;
}

export class UpdateCompetencyDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    competency_name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    competency_code: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    competency_admin_email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    status: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    total_project: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    total_employee: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    competency_head: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;
}

export class CompetencyIdDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string;
}

export class DeleteCompetencyDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string;
}
