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
  CreateEmployeeSkillDto,
  EmployeeSkillNameDto,
} from './employeeSKill.dto';

export const createEmployeeSkillSwagger = () => {
  return applyDecorators(
    ApiTags('employeeSkill'),
    ApiOperation({ summary: 'Create a new employeeSkill' }),
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
      type: CreateEmployeeSkillDto,
      description: 'Data required to create a new employeeSkill',
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};

export const checkEmployeeSkillByNameSwagger = () => {
  return applyDecorators(
    ApiTags('employeeSkill'),
    ApiOperation({ summary: 'Check if employeeSkill name is available' }),
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
      type: EmployeeSkillNameDto,
      description: 'employeeSkill name to check availability',
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};


export const getAllEmployeeSkillsSwagger = () => {
  return applyDecorators(
    ApiTags('employeeSkill'),
    ApiOperation({ summary: 'Get all skills' }),
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
  );
};

export const getEmployeeSkillByEmployeeIdSwagger = () => {
  return applyDecorators(
    ApiTags('employeeSkill'),
    ApiOperation({ summary: 'Get a employeeSkill by employee ID' }),
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
      name: 'employee_id',
      description: 'ID of the employee id to retrieve skills',
      type: 'string',
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
    ApiNotFoundResponse({
      description: 'employeeSkill with employee Id not found',
    }),
  );
};

export const deleteEmployeeSkillSwagger = () => {
  return applyDecorators(
    ApiTags('employeeSkill'),
    ApiOperation({ summary: 'Delete a employeeSkill' }),
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
      name: 'id',
      description: 'ID of the skill to delete',
      type: 'string',
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
    ApiNotFoundResponse({ description: 'employeeSkill not found' }),
  );
};
