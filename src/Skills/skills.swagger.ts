import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags, ApiBadRequestResponse, ApiBody, ApiParam, ApiNotFoundResponse } from '@nestjs/swagger';
import { CreateSkillDto, SkillNameDto} from './skills.dto';

export const createSkillSwagger = () => {
  return applyDecorators(
    ApiTags('skill'),
    ApiOperation({ summary: 'Create a new skill' }),
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
      type: CreateSkillDto,
      description: 'Data required to create a new skill',
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};

export const skillNameSwagger = () => {
  return applyDecorators(
    ApiTags('skill'),
    ApiOperation({ summary: 'Check if skill name is available' }),
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
      type: SkillNameDto,
      description: 'Competency skill to check availability',
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};

export const getSkillByIdSwagger = () => {
  return applyDecorators(
    ApiTags('skill'),
    ApiOperation({ summary: 'Get a skill by ID' }),
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
      description: 'ID of the skill to retrieve',
      type: 'string',
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
    ApiNotFoundResponse({ description: 'skill not found' }),
  );
};


export const getAllSkillsSwagger = () => {
  return applyDecorators(
    ApiTags('skill'),
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


