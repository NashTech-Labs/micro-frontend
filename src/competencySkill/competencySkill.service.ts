import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../tenant/tenant.entity';
import { employeeSkillQueriesService } from './competencySkillQueries.service'; // Import the new service
import { SkillsQueriesService } from '../Skills/skillsQueries.service'; // Import the new service
import { EmployeeQueriesService } from '../user/employeeQueries.service';
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
      await this.employeeSkillQueriesService.checkEmployeeSkillByName(
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

  async getSkillsBySkillName(
    skill_name: string,
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
      await this.employeeSkillQueriesService.getSkillsBySkillName(
        nameTenant,
        skill_name,
      );
    if (employeeSkill.length === 0) {
      return {
        message: 'No skill is added.',
        data: [],
      };    }
    let obj = {};
    obj['skill_name'] = skill_name;
    var finalData = [];
    for (let i = 0; i < employeeSkill.length; i++) {
      let empData = await this.UserQueries.getUserById(
        nameTenant,
        employeeSkill[i].employee_id,
      );
      if (empData.data != null) {
        employeeSkill[i].employee_name = empData.data.first_name;
        employeeSkill[i].employee_designation = empData.data.designation;

        delete employeeSkill[i].skill_name;
        finalData.push(employeeSkill[i]);
      }
    }
    obj['employee data'] = finalData;

    if (finalData.length > 0) {
      return {
        message: 'employeeSkill retrieved successfully.',
        data: obj,
      };
    } else {
      throw new BadRequestException('employee with skill does not exist');
    }
  }

  async getSkillsByLevel(
    skill_name: string,
    level: string,
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
      await this.employeeSkillQueriesService.getSkillsByLevel(
        nameTenant,
        skill_name,
        level,
      );
    if (employeeSkill && employeeSkill.length === 0) {
      return {
        message: 'No skill is added.',
        data: [],
          }
        }
    let obj = {};
    obj['skill_name'] = skill_name;
    obj['level'] = level;
    var finalData = [];
    for (let i = 0; i < employeeSkill.length; i++) {
      let empData = await this.UserQueries.getUserById(
        nameTenant,
        employeeSkill[i].employee_id,
      );
      if (empData.data != null) {
        employeeSkill[i].employee_name = empData.data.first_name;
        employeeSkill[i].employee_designation = empData.data.designation;
        delete employeeSkill[i].skill_name;
        delete employeeSkill[i].level;
        finalData.push(employeeSkill[i]);
      }
    }
    obj['employee data'] = finalData;

    if (finalData.length > 0) {
      return {
        message: 'employeeSkill retrieved successfully.',
        data: obj,
      };
    } else {
      throw new BadRequestException('employee with skill does not exist');
    }
  }

  async getSkillsByCompetency(
    studio_id: string,
    tenantCode: string,
  ): Promise<{ message: string; data: any }> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantCode },
    });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }


    let nameTenant = tenant.tenant_name;

    let studioData = await this.CompetencyService.getCompetencyById(
      studio_id,
      tenantCode,
    );
    if (studioData.data == null) {
      throw new NotFoundException('Studio Not found');
    }
    const employeeSkill =
      await this.employeeSkillQueriesService.getSkillsByCompetency(
        nameTenant,
        studio_id,
      );

    if (employeeSkill && employeeSkill.length === 0) {
      return {
        message: 'No skill is added.',
        data: [],
          }    }
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
      message: 'Skill retrieved successfully.',
      data: finalData,
    };
  }
}
