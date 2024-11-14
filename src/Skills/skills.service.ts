import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as Joi from 'joi';
import { Tenant } from '../tenant/tenant.entity';
import { SkillsQueriesService } from './skillsQueries.service'; // Import the new service

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    private readonly skillsQueriesService: SkillsQueriesService, // Inject the new service
  ) {}

  async createSkill(
    tenantCode: string,
    userData: any,
  ): Promise<{ message: string; data?: any }> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantCode },
    });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    let nameTenant = tenant.tenant_name;
    const existingSkill =
      await this.skillsQueriesService.checkSkillName(
        nameTenant,
        userData.skill_name,
      );

    if (existingSkill.length > 0) {
      throw new BadRequestException(
        'skill with this name already exists. Please use another name.',
      );
    }

    const code = Math.floor(Math.random() * 9000) + 1000;
    await this.skillsQueriesService.createSkill(
      nameTenant,
      userData,
    );

    const competencyData =
      await this.skillsQueriesService.checkSkillName(
        nameTenant,
        userData.skill_name,
      );

    return {
      message: 'skill created successfully and data saved.',
      data: competencyData,
    };
  }

  async skillName(
    tenantCode: string,
    userData: any,
  ): Promise<{ message: string; data?: any }> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantCode },
    });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    let nameTenant = tenant.tenant_name;
    const existingSkill =
      await this.skillsQueriesService.checkSkillName(
        nameTenant,
        userData.skill_name,
      );
    if (existingSkill.length > 0) {
      throw new BadRequestException(
        'Skill with this name already exists. Please use another name.',
      );
    } else {
      return { message: 'Skill with this name can be created' };
    }
  }

  async getAllSkills(
    tenantCode: string,
  ): Promise<{ message: string; data: any[] }> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantCode },
    });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    let nameTenant = tenant.tenant_name;
    const competencies =
      await this.skillsQueriesService.getAllSkills(nameTenant);

    return {
      message: 'Retrieved all skills successfully.',
      data: competencies,
    };
  }

  async getSkillById(
    id: string,
    tenantCode: string,
  ): Promise<{ message: string; data: any }> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantCode },
    });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    let nameTenant = tenant.tenant_name;
    const skill = await this.skillsQueriesService.getSkillById(
      nameTenant,
      id,
    );

    if (skill.length === 0) {
      throw new NotFoundException('skill not found');
    }
    return {
      message: 'skill retrieved successfully.',
      data: skill[0],
    };
  }

  
}