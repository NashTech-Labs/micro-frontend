import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
  ApiBadRequestResponse,
  ApiBody,
  ApiParam,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import {
  EmployeeBySkillDto,
  EmployeeByLevelDto,
  EmployeeByStudioDto,
} from './competencySKill.dto';

export const getSkillsBySkillNameSwagger = () => {
  return applyDecorators(
    ApiTags('competencySkills'),
    ApiOperation({
      summary: 'Check if employee is available of following skill',
    }),
    ApiBearerAuth(),
    ApiHeader({
      name: 'token',
      description: 'JWT token for authentication',
      required: false,
    }),
    ApiHeader({
      name: 'tenant_code',
      description: 'Code of the tenant',
      required: true,
    }),
    ApiParam({
      name: 'skill_name',
      description: 'Employee of skill_name has to retrieve',
      type: 'string',
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};

export const getSkillsByLevelSwagger = () => {
  return applyDecorators(
    ApiTags('competencySkills'),
    ApiOperation({
      summary: 'Check if employee is available of following skill',
    }),
    ApiBearerAuth(),
    ApiHeader({
      name: 'token',
      description: 'JWT token for authentication',
      required: false,
    }),
    ApiHeader({
      name: 'tenant_code',
      description: 'Code of the tenant',
      required: true,
    }),
    ApiParam({
      name: 'level',
      description: 'Employee of level has to retrieve',
      type: 'string',
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};

export const getSkillsByCompetencySwagger = () => {
  return applyDecorators(
    ApiTags('competencySkills'),
    ApiOperation({
      summary: 'Check if skills is available of following skill',
    }),
    ApiBearerAuth(),
    ApiHeader({
      name: 'token',
      description: 'JWT token for authentication',
      required: false,
    }),
    ApiHeader({
      name: 'tenant_code',
      description: 'Code of the tenant',
      required: true,
    }),
    ApiBody({
      type: EmployeeByStudioDto,
      description: 'Data required to create a new employeeSkill',
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};
