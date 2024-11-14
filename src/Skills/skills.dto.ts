import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsNumber } from 'class-validator';

export class CreateSkillDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    skill_name: string; 

}

export class SkillNameDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    skill_name: string;
}


export class SkillIdDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string;
}

export class DeleteSkillDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string;
}
