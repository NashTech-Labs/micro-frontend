import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../tenant/tenant.entity';
import { EmployeeQueriesService } from './employeeQueries.service';
import * as Joi from 'joi';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    private readonly employeeQueriesService: EmployeeQueriesService, // Correctly inject the service here
  ) {}

  async createUser(
    tenantCode: string,
    userData: any,
  ): Promise<{ message: string; data?: any }> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantCode },
    });

    if (!tenant) {
      throw new Error('Tenant not found');
    }

    userData.tenant_id = tenant.id;
    userData.tenant_code = tenant.tenant_code;
    const nameTenant = tenant.tenant_name;
    try {
      const result = await this.employeeQueriesService.createEmployee(
        nameTenant,
        userData,
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async getAllUsers(
    tenantCode: string,
  ): Promise<{ message: string; data: any }> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantCode },
    });
    if (!tenant) {
      throw new Error('Tenant not found');
    }
    const nameTenant = tenant.tenant_name;
    try {
      const users =
        await this.employeeQueriesService.getAllEmployees(nameTenant);
      return users;
    } catch (error) {
      throw new Error(`Failed to get all users: ${error.message}`);
    }
  }

  async getAllDesignations(
    tenantCode: string,
  ): Promise<{ message: string; data: any }> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantCode },
    });
    if (!tenant) {
      throw new Error('Tenant not found');
    }
    const nameTenant = tenant.tenant_name;
    try {
      const designations =
        await this.employeeQueriesService.getAllDesignations(nameTenant);
      return designations;
    } catch (error) {
      throw new Error(`Failed to get all designations: ${error.message}`);
    }
  }

  async getUserById(
    id: string,
    tenantCode: string,
  ): Promise<{ message: string; data: any }> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantCode },
    });
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    const schema = Joi.object({
      id: Joi.string().required(),
    });
    const { error } = schema.validate({ id });
    if (error) {
      throw new BadRequestException(
        error.details[0].message.replace(/\"(\w+)\"/g, '$1'),
      );
    }

    const nameTenant = tenant.tenant_name;
    try {
      const result = await this.employeeQueriesService.getUserById(
        nameTenant,
        id,
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to get user by ID: ${error.message}`);
    }
  }

  async updateUser(
    id: string,
    tenantCode: string,
    userData: any,
  ): Promise<{ message: string; data?: any }> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantCode },
    });
    if (!tenant) {
      throw new BadRequestException('Tenant not found');
    }

    const nameTenant = tenant.tenant_name;
    try {
      const result = await this.employeeQueriesService.updateEmployee(
        nameTenant,
        id,
        userData,
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async deleteUser(
    id: string,
    tenantCode: string,
  ): Promise<{ message: string }> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantCode },
    });
    if (!tenant) {
      throw new BadRequestException('Tenant not found');
    }
    const nameTenant = tenant.tenant_name;
    try {
      const result = await this.employeeQueriesService.deleteEmployee(
        nameTenant,
        id,
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  async filterUsersByLocation(
    tenantCode: string,
    location: string,
  ): Promise<{ message: string; data: any }> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantCode },
    });
    if (!tenant) {
      throw new BadRequestException('Tenant not found');
    }
    const schema = Joi.object({
      location: Joi.string().required(),
    });

    const { error } = schema.validate({ location });
    if (error) {
      throw new BadRequestException(
        error.details[0].message.replace(/\"(\w+)\"/g, '$1'),
      );
    }

    const nameTenant = tenant.tenant_name;
    try {
      const result = await this.employeeQueriesService.filterUsersByLocation(
        nameTenant,
        location,
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to filter users: ${error.message}`);
    }
  }

  async filterUsersByName(
    tenantCode: string,
    name: string,
  ): Promise<{ message?: string; data?: any }> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantCode },
    });
    if (!tenant) {
      throw new BadRequestException('Tenant not found');
    }
    const schema = Joi.object({
      name: Joi.string().required(),
    });

    const { error } = schema.validate({ name });
    if (error) {
      throw new BadRequestException(
        error.details[0].message.replace(/\"(\w+)\"/g, '$1'),
      );
    }
    const nameTenant = tenant.tenant_name;
    try {
      const result = await this.employeeQueriesService.filterUsersByName(
        nameTenant,
        name,
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to filter users: ${error.message}`);
    }
  }
}
