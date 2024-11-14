import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
  ApiBadRequestResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

export const createPracticeSwagger = () => {
  return applyDecorators(
    ApiTags('practice'),
    ApiOperation({ summary: 'Create a new practice' }),
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
      schema: {
        properties: {
          title: { type: 'string', description: 'Title of the practice' },
          description: {
            type: 'string',
            description: 'Description of the practice',
          },
          total_employee: {
            type: 'number',
            description: 'Total employees in the practice',
          },
          studio_head: {
            type: 'string',
            description: 'Studio head of the practice',
          },
          status: { type: 'string', description: 'Status of the practice' },
          location: {
            type: 'string',
            description: 'Image URL of the practice',
          },
        },
        required: [
          'title',
          'description',
          'total_employee',
          'studio_head',
          'status',
          'image',
        ],
      },
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};

export const getPracticeSwagger = () => {
  return applyDecorators(
    ApiTags('practice'),
    ApiOperation({ summary: 'Get all practices' }),
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
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};

export const getPracticeByIdSwagger = () => {
  return applyDecorators(
    ApiTags('practice'),
    ApiOperation({ summary: 'Get practice by ID' }),
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
      description: 'ID of the practice',
      required: true,
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};

export const updatePracticeSwagger = () => {
  return applyDecorators(
    ApiTags('practice'),
    ApiOperation({ summary: 'Update a practice' }),
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
      description: 'ID of the practice to update',
      required: true,
    }),
    ApiBody({
      schema: {
        properties: {
          title: { type: 'string', description: 'Title of the practice' },
          description: {
            type: 'string',
            description: 'Description of the practice',
          },
          total_employee: {
            type: 'number',
            description: 'Total employees in the practice',
          },
          studio_head: {
            type: 'string',
            description: 'Studio head of the practice',
          },
          status: { type: 'string', description: 'Status of the practice' },
          image: { type: 'string', description: 'Image URL of the practice' },
          location: {
            type: 'string',
            description: 'location URL of the practice',
          },
        },
        required: [
          'title',
          'description',
          'total_employee',
          'studio_head',
          'status',
          'image',
        ],
      },
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};

export const deletePracticeSwagger = () => {
  return applyDecorators(
    ApiTags('practice'),
    ApiOperation({ summary: 'Delete a practice' }),
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
      description: 'ID of the practice to delete',
      required: true,
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};

export const practiceNameSwagger = () => {
  return applyDecorators(
    ApiTags('practice'),
    ApiOperation({ summary: 'Get practice by name' }),
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
      schema: {
        properties: {
          title: { type: 'string', description: 'Title of the practice' },
        },
        required: ['title'],
      },
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};
