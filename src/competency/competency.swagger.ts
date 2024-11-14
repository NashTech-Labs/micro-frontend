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
  CreateCompetencyDto,
  CompetencyNameDto,
  UpdateCompetencyDto,
} from './competency.dto';

export const createCompetencySwagger = () => {
  return applyDecorators(
    ApiTags('competency'),
    ApiOperation({ summary: 'Create a new competency' }),
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
      type: CreateCompetencyDto,
      description: 'Data required to create a new competency',
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};

export const competencyNameSwagger = () => {
  return applyDecorators(
    ApiTags('competency'),
    ApiOperation({ summary: 'Check if competency name is available' }),
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
      type: CompetencyNameDto,
      description: 'Competency name to check availability',
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};

export const getAllCompetenciesSwagger = () => {
  return applyDecorators(
    ApiTags('competency'),
    ApiOperation({ summary: 'Get all competencies' }),
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

export const getCompetencyByIdSwagger = () => {
  return applyDecorators(
    ApiTags('competency'),
    ApiOperation({ summary: 'Get a competency by ID' }),
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
      description: 'ID of the competency to retrieve',
      type: 'string',
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
    ApiNotFoundResponse({ description: 'Competency not found' }),
  );
};

export const updateCompetencySwagger = () => {
  return applyDecorators(
    ApiTags('competency'),
    ApiOperation({ summary: 'Update a competency' }),
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
      description: 'ID of the competency to update',
      type: 'string',
    }),
    ApiBody({
      type: UpdateCompetencyDto,
      description: 'Data to update the competency',
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
    ApiNotFoundResponse({ description: 'Competency not found' }),
  );
};

export const deleteCompetencySwagger = () => {
  return applyDecorators(
    ApiTags('competency'),
    ApiOperation({ summary: 'Delete a competency' }),
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
      description: 'ID of the competency to delete',
      type: 'string',
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
    ApiNotFoundResponse({ description: 'Competency not found' }),
  );
};
