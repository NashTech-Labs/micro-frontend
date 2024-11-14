import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../tenant/tenant.entity';
import { employeeSkillQueriesService } from './employeeSkillQueries.service'; // Import the new service
import { SkillsQueriesService } from './../Skills/skillsQueries.service'; // Import the new service
import { EmployeeQueriesService } from './../user/employeeQueries.service';
import { CompetencyService } from './../competency/competency.service';

@Injectable()
export class employeeSkillService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    private readonly employeeSkillQueriesService: employeeSkillQueriesService, // Inject the new service
    private readonly skillsQueriesService: SkillsQueriesService, // Inject the new service
    private readonly UserQueries: EmployeeQueriesService, // Inject the new service
    private readonly CompetencyService: CompetencyService, // Inject the new service
  ) {}

  async createEmployeeSkill(
    tenantCode: string,
    userData: any,
  ): Promise<{ message?: string; data?: any }> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantCode },
    });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    let nameTenant = tenant.tenant_name;
    let empData = await this.UserQueries.getUserById(
      nameTenant,
      userData.employee_id,
    );
    if (empData.data == null) {
      throw new NotFoundException('Employee Not found');
    }

    let studioData = await this.CompetencyService.getCompetencyById(
      userData.studio_id,
      tenantCode,
    );
    if (studioData.data == null) {
      throw new NotFoundException('Studio Not found');
    }

    let skillCheck = await this.skillsQueriesService.checkSkillName(
      nameTenant,
      userData.skill_name,
    );
    if (skillCheck.length == 0) {
      await this.skillsQueriesService.createSkill(nameTenant, userData);
    }

    const existingemployeeSkill =
      await this.employeeSkillQueriesService.checkEmployeeSkillByNameAndEmployeeAndStudio(
        nameTenant,
        userData.skill_name,
        userData.employee_id,
        userData.studio_id,
    
      );
      


    if (existingemployeeSkill && existingemployeeSkill.length > 0) {
      throw new BadRequestException(
        'employeeSkill with this name already exists. Please use another name.',
      );
    }
    await this.employeeSkillQueriesService.createEmployeeSkill(
      nameTenant,
      userData,
    );
    const data =
      await this.employeeSkillQueriesService.checkEmployeeSkillByNameAndLevel(
        nameTenant,
        userData.skill_name,
        userData.employee_id,
        userData.level,
      );
    if (data) {
      return {
        message: 'employeeSkill created successfully and data saved.',
        data: data,
      };
    } else {
      throw new BadRequestException(
        'employee with this skill cannot be created',
      );
    }
  }

  async checkEmployeeSkillByName(
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
    const existingemployeeSkill =
      await this.employeeSkillQueriesService.checkEmployeeSkillByNameAndLevel(
        nameTenant,
        userData.skill_name,
        userData.employee_id,
        userData.level,
      );

    if (existingemployeeSkill && existingemployeeSkill.length > 0) {
      throw new BadRequestException(
        'Skill with this name already exists. Please use another name.',
      );
    } else {
      return { message: 'Skill with this name can be created' };
    }
  }

  async getAllEmployeeSkills(
    tenantCode: string,
  ): Promise<{ message: string; data: any }> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantCode },
    });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    let nameTenant = tenant.tenant_name;
    const employeeSkill =
      await this.employeeSkillQueriesService.getAllEmployeeSkills(nameTenant);

    if (employeeSkill && employeeSkill.length === 0) {
      return {
        message: 'No skill is added',
        data: [],
      };
    }

    var finalData = [];
    for (let i = 0; i < employeeSkill.length; i++) {
      let empData = await this.UserQueries.getUserById(
        nameTenant,
        employeeSkill[i].employee_id,
      );
      if (empData.data != null) {
        employeeSkill[i].employee_name = empData.data.first_name;
        employeeSkill[i].employee_designation = empData.data.designation;

        finalData.push(employeeSkill[i]);
      }
    }
    return {
      message: 'employeeSkill retrieved successfully.',
      data: finalData,
    };
  }

  async getEmployeeSkillByEmployeeId(
    employee_id: string,
    tenantCode: string,
  ): Promise<{ message: string; data: any }> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantCode },
    });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    let nameTenant = tenant.tenant_name;
    const employeeSkill =
      await this.employeeSkillQueriesService.getEmployeeSkillByEmployeeId(
        nameTenant,
        employee_id,
      );

    if (employeeSkill && employeeSkill.length === 0) {
      return {
        message: 'No skill is added.',
        data: [],
      };
    }
    return {
      message: 'employeeSkill retrieved successfully.',
      data: employeeSkill,
    };
  }

  async deleteEmployeeSkill(
    id: string,
    tenantCode: string,
  ): Promise<{ message: string }> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantCode },
    });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    let nameTenant = tenant.tenant_name;
    await this.employeeSkillQueriesService.deleteEmployeeSkill(
      nameTenant,
      id,
    );
    return { message: 'employeeSkill deleted successfully.' };
  }
}
