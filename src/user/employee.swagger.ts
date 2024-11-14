import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiHeader,
  ApiQuery,
  ApiBody,
  ApiBadRequestResponse,
  ApiParam,
} from '@nestjs/swagger';
import { CreateUserDto, updateReportingDto, UpdateUserDto } from './user.dto';

export const createUserSwagger = () => {
  return applyDecorators(
    ApiTags('employee'),
    ApiOperation({ summary: 'Create a new user' }),
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
      type: CreateUserDto,
      description: 'User data to create a new user',
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};

export const filterUsersByNameSwagger = () => {
  return applyDecorators(
    ApiTags('employee'),
    ApiOperation({ summary: 'Filter users by name' }),
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
    ApiQuery({
      name: 'name',
      description: 'Name of the user to filter by',
      required: true,
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};

export const checkUsersByEmailSwagger = () => {
  return applyDecorators(
    ApiTags('employee'),
    ApiOperation({ summary: 'Filter users by email' }),
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
    ApiQuery({
      name: 'email',
      description: 'email of the user to filter by',
      required: true,
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};

export const getAllUsersSwagger = () => {
  return applyDecorators(
    ApiTags('employee'),
    ApiOperation({ summary: 'Get all users' }),
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

export const getAllDesignationsSwagger = () => {
  return applyDecorators(
    ApiTags('employee'),
    ApiOperation({ summary: 'Get all designations' }),
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

export const getUserByIdSwagger = () => {
  return applyDecorators(
    ApiTags('employee'),
    ApiOperation({ summary: 'Get user by ID' }),
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
      description: 'ID of the user',
      required: true,
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};

export const updateUserSwagger = () => {
  return applyDecorators(
    ApiTags('employee'),
    ApiOperation({ summary: 'Update user' }),
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
      type: UpdateUserDto,
      description: 'User data to update',
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};

export const updateReportingSwagger = () => {
  return applyDecorators(
    ApiTags('employee'),
    ApiOperation({ summary: 'Update user' }),
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
      type: updateReportingDto,
      description: 'User data to update',
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};

export const deleteUserSwagger = () => {
  return applyDecorators(
    ApiTags('employee'),
    ApiOperation({ summary: 'Delete user' }),
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
      description: 'ID of the user',
      required: true,
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};

export const filterUsersByLocationSwagger = () => {
  return applyDecorators(
    ApiTags('employee'),
    ApiOperation({ summary: 'Filter users by location' }),
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
    ApiQuery({
      name: 'location',
      description: 'Location to filter users by',
      required: true,
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};
