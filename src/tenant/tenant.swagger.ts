// src/tenant/tenant.swagger.ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiHeader,
  ApiQuery,
  ApiBody,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import {
  CreateTenantDto,
  UpdateTenantDto,
  DeleteTenantDto,
  CreateRegisteredDto,
} from './tenant.dto';

export const createTenantSwagger = () => {
  return applyDecorators(
    ApiTags('tenant'),
    ApiOperation({ summary: 'Create a new tenant' }),
    ApiBearerAuth(),
    ApiHeader({
      name: 'token',
      description: 'JWT token for authentication',
      required: false,
    }),
    ApiBody({
      type: CreateTenantDto,
      description: 'Tenant data to create a new tenant',
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};

export const createRegisterSwagger = () => {
  return applyDecorators(
    ApiTags('tenant'),
    ApiOperation({ summary: 'Create a new tenant' }),
    ApiBearerAuth(),
    ApiHeader({
      name: 'token',
      description: 'JWT token for authentication',
      required: false,
    }),
    ApiBody({
      type: CreateRegisteredDto,
      description: 'Tenant data to create a new tenant',
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};

export const getAllTenantsSwagger = () => {
  return applyDecorators(
    ApiTags('tenant'),
    ApiOperation({ summary: 'Get all tenants' }),
    ApiBearerAuth(),
    ApiHeader({
      name: 'token',
      description: 'JWT token for authentication',
      required: false,
    }),
  );
};

export const getTenantByIdSwagger = () => {
  return applyDecorators(
    ApiTags('tenant'),
    ApiOperation({ summary: 'Get tenant by ID' }),
    ApiBearerAuth(),
    ApiHeader({
      name: 'token',
      description: 'JWT token for authentication',
      required: false,
    }),
    ApiQuery({
      name: 'id',
      description: 'ID of the tenant',
      required: true,
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};

export const updateTenantSwagger = () => {
  return applyDecorators(
    ApiTags('tenant'),
    ApiOperation({ summary: 'Update tenant' }),
    ApiBearerAuth(),
    ApiHeader({
      name: 'token',
      description: 'JWT token for authentication',
      required: false,
    }),
    ApiBody({
      type: UpdateTenantDto,
      description: 'Tenant data to update',
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};

export const deleteTenantSwagger = () => {
  return applyDecorators(
    ApiTags('tenant'),
    ApiOperation({ summary: 'Delete tenant' }),
    ApiBearerAuth(),
    ApiHeader({
      name: 'token',
      description: 'JWT token for authentication',
      required: false,
    }),
    ApiBody({
      type: DeleteTenantDto,
      description: 'Tenant data to delete',
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};
