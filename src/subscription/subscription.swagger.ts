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

export const createSubscriptionSwagger = () => {
  return applyDecorators(
    ApiTags('subscription'),
    ApiOperation({ summary: 'Create a new subscription' }),
    ApiBearerAuth(),
    ApiHeader({
      name: 'token',
      description: 'JWT token for authentication',
      required: false,
    }),
    ApiBody({
      schema: {
        properties: {
          planName: {
            type: 'string',
            description: 'Name of the plan',
            example: 'Basic Plan',
          },
          numberOfEmployees: {
            type: 'number',
            description: 'Number of employees included in the plan',
            example: 50,
          },
          planDuration: {
            type: 'number',
            description: 'Duration of the plan in months',
            example: 12,
          },
          planDescription: {
            type: 'string',
            description: 'Description of the plan',
            example:
              'This plan includes basic features for up to 50 employees.',
          },
          price: {
            type: 'number',
            description: 'Price of the plan',
            example: 199.99,
          },
          status: {
            type: 'string',
            description: 'Status of the plan',
            example: 'active',
          },
        },
        required: [
          'planName',
          'numberOfEmployees',
          'planDuration',
          'price',
          'status',
        ],
      },
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};

export const getSubscriptionSwagger = () => {
  return applyDecorators(
    ApiTags('subscription'),
    ApiOperation({ summary: 'Get all subscription' }),
    ApiBearerAuth(),
    ApiHeader({
      name: 'token',
      description: 'JWT token for authentication',
      required: false,
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};

export const subscriptionByIdSwagger = () => {
  return applyDecorators(
    ApiTags('subscription'),
    ApiOperation({ summary: 'Get subscription by ID' }),
    ApiBearerAuth(),
    ApiHeader({
      name: 'token',
      description: 'JWT token for authentication',
      required: false,
    }),
    ApiParam({
      name: 'id',
      description: 'ID of the subscription',
      required: true,
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};

export const subscriptionNameSwagger = () => {
  return applyDecorators(
    ApiTags('subscription'),
    ApiOperation({ summary: 'Get all subscription' }),
    ApiBearerAuth(),
    ApiHeader({
      name: 'token',
      description: 'JWT token for authentication',
      required: false,
    }),
    ApiBody({
      schema: {
        properties: {
          planName: { type: 'string' },
        },
        required: ['planName'],
      },
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};

export const updateSubscriptionSwagger = () => {
  return applyDecorators(
    ApiTags('subscription'),
    ApiOperation({ summary: 'Update a subscription' }),
    ApiBearerAuth(),
    ApiHeader({
      name: 'token',
      description: 'JWT token for authentication',
      required: false,
    }),
    ApiParam({
      name: 'id',
      description: 'ID of the subscription to update',
      required: true,
    }),
    ApiBody({
      schema: {
        properties: {
          planName: {
            type: 'string',
            description: 'Name of the plan',
            example: 'Basic Plan',
          },
          numberOfEmployees: {
            type: 'number',
            description: 'Number of employees included in the plan',
            example: 50,
          },
          planDuration: {
            type: 'number',
            description: 'Duration of the plan in months',
            example: 12,
          },
          planDescription: {
            type: 'string',
            description: 'Description of the plan',
            example:
              'This plan includes basic features for up to 50 employees.',
          },
          price: {
            type: 'number',
            description: 'Price of the plan',
            example: 199.99,
          },
          status: {
            type: 'string',
            description: 'Status of the plan',
            example: 'active',
          },
        },
        required: [
          'planName',
          'numberOfEmployees',
          'planDuration',
          'price',
          'status',
        ],
      },
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};

export const deleteSubscriptionSwagger = () => {
  return applyDecorators(
    ApiTags('subscription'),
    ApiOperation({ summary: 'Delete a subscription' }),
    ApiBearerAuth(),
    ApiHeader({
      name: 'token',
      description: 'JWT token for authentication',
      required: false,
    }),
    ApiParam({
      name: 'id',
      description: 'ID of the subscription to delete',
      required: true,
    }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
  );
};
