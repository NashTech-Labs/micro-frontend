import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
  ApiBadRequestResponse,
  ApiBody,
  ApiParam,
  ApiNotFoundResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import {
  CreateProjectDto,
  ProjectNameDto,
  UpdateProjectDto,
} from './project.dto';
import { FileInterceptor } from '@nestjs/platform-express';

export const createProjectSwagger = () => {
  return applyDecorators(
    ApiTags('project'),
    ApiOperation({ summary: 'Create a new project' }),
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
    ApiConsumes('multipart/form-data'),
    // UseInterceptors(FileInterceptor('file')),
    ApiBody({
      type: CreateProjectDto,
      description: 'Data required to create a new project',
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};


export const getAllProjectsSwagger = () => {
  return applyDecorators(
    ApiTags('project'),
    ApiOperation({ summary: 'Get all projects' }),
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

export const getProjectByIdSwagger = () => {
  return applyDecorators(
    ApiTags('project'),
    ApiOperation({ summary: 'Get a project by ID' }),
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
      description: 'ID of the project to retrieve',
      type: 'string',
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
    ApiNotFoundResponse({ description: 'project not found' }),
  );
};

export const updateProjectSwagger = () => {
  return applyDecorators(
    ApiTags('project'),
    ApiOperation({ summary: 'Update a project' }),
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
      description: 'ID of the project to update',
      type: 'string',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      type: UpdateProjectDto,
      description: 'Data to update the project',
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
    ApiNotFoundResponse({ description: 'project not found' }),
  );
};

export const deleteProjectSwagger = () => {
  return applyDecorators(
    ApiTags('project'),
    ApiOperation({ summary: 'Delete a project' }),
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
      description: 'ID of the project to delete',
      type: 'string',
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
    ApiNotFoundResponse({ description: 'project not found' }),
  );
};
