import { Injectable, BadRequestException } from '@nestjs/common';
import { Tenant } from '../tenant/tenant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PracticeQueriesService } from './practiceQueries.service';

@Injectable()
export class PracticeService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    private readonly practiceQueriesService: PracticeQueriesService,
  ) {}

  async createPractice(
    tenantName: string,
    userData: any,
  ): Promise<{ message: string; data?: any }> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantName },
    });
    if (!tenant) {
      throw new BadRequestException('Tenant not found');
    }

    const nameTenant = tenant.tenant_name;
    const practices = await this.practiceQueriesService.checkPracticeName(
      nameTenant,
      userData.title,
    );
    if (practices.length > 0) {
      throw new BadRequestException(
        'Practice with this name already exists. Please use another name.',
      );
    }
    const practiceData = await this.practiceQueriesService.createPractice(
      nameTenant,
      userData,
    );
    return {
      message: 'Practice created successfully and data saved.',
      data: practiceData,
    };
  }

  async practiceName(tenantName: string, data: any) {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantName },
    });
    if (!tenant) {
      throw new BadRequestException('Tenant not found');
    }
    const nameTenant = tenant.tenant_name;
    const practices = await this.practiceQueriesService.checkPracticeName(
      nameTenant,
      data.title,
    );
    if (practices.length > 0) {
      throw new BadRequestException(
        'Practice with this name already exists. Please use another name.',
      );
    }
    return { message: 'Practice with this title can be created' };
  }

  async getAllPractices(
    tenantName: string,
  ): Promise<{ message: string; data: any[] }> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantName },
    });
    if (!tenant) {
      throw new BadRequestException('Tenant not found');
    }
    const nameTenant = tenant.tenant_name;
    const practices =
      await this.practiceQueriesService.getAllPractices(nameTenant);
    return {
      message: 'Retrieved all practices successfully.',
      data: practices,
    };
  }

  async getPracticeById(
    id: string,
    tenantName: string,
  ): Promise<{ message: string; data: any }> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantName },
    });
    if (!tenant) {
      throw new BadRequestException('Tenant not found');
    }
    const nameTenant = tenant.tenant_name;
    const practice = await this.practiceQueriesService.getPracticeById(
      nameTenant,
      id,
    );
    if (practice.length === 0) {
      return { message: 'Practice not found.', data: null };
    }
    return { message: 'Practice retrieved successfully.', data: practice[0] };
  }

  async updatePractice(
    id: string,
    tenantName: string,
    userData: any,
  ): Promise<{ message: string; data?: any }> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantName },
    });
    if (!tenant) {
      throw new BadRequestException('Tenant not found');
    }
    const nameTenant = tenant.tenant_name;
    const practiceData = await this.practiceQueriesService.updatePractice(
      nameTenant,
      id,
      userData,
    );
    return {
      message: 'Practice data updated successfully.',
      data: practiceData,
    };
  }

  async deletePractice(
    id: string,
    tenantName: string,
  ): Promise<{ message: string }> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantName },
    });
    if (!tenant) {
      throw new BadRequestException('Tenant not found');
    }
    const nameTenant = tenant.tenant_name;
    await this.practiceQueriesService.deletePractice(nameTenant, id);
    return { message: 'Practice deleted successfully.' };
  }
}
