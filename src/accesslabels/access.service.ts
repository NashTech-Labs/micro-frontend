import { Injectable, BadRequestException } from '@nestjs/common';
import { Tenant } from '../tenant/tenant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { accessLabelQueriesService } from './accessQueries.service';

@Injectable()
export class accessLabelService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    private readonly accessLabelQueriesService: accessLabelQueriesService,
  ) {}

  async checkTenant(
    tenantName: string,
  ): Promise<any> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantName },
    });
    if (!tenant) {
      throw new BadRequestException('Tenant not found');

  }else{
    return tenant
  }
}

  async createAccess(
    tenantName: string,
    userData : any
  ): Promise<{ message: string; data?: any }> {
    let tenant  = await this.checkTenant(tenantName)
    const nameTenant = tenant.tenant_name;
    
    const accessData = await this.accessLabelQueriesService.createAccess(
      nameTenant,
      userData
    );
    return {
      message: 'Access labels created successfully and data saved.',
      data: accessData,
    };
  }

  

  async getAllAccess(
    tenantName: string,
  ): Promise<{ message: string; data: any[] }> {
    let tenant  = await this.checkTenant(tenantName)
    const nameTenant = tenant.tenant_name;
    const practices =
      await this.accessLabelQueriesService.getAllAccess(nameTenant);
    return {
      message: 'Retrieved all access la bels successfully.',
      data: practices,
    };
  }

  async getAccessByEmployeeId(
    id: string,
    tenantName: string,
  ): Promise<{ message: string; data: any }> {
    let tenant  = await this.checkTenant(tenantName)
    const nameTenant = tenant.tenant_name;
    const access = await this.accessLabelQueriesService.getAccessByEmployeeId(
      nameTenant,
      id,
    );
    if (access.length === 0) {
      return { message: 'Access labels for this employee not found.', data: null };
    }
    return access[0] ;
  }

  async updateAccessByEmployeeId(
    id: string,
    tenantName: string,
    userData: any,
  ): Promise<{ message: string; data?: any }> {
    let tenant  = await this.checkTenant(tenantName)
    const nameTenant = tenant.tenant_name;
    const accessData = await this.accessLabelQueriesService.updateAccessByEmployeeId(
      nameTenant,
      id,
      userData,
    );
    return {
      message: 'Access label data updated successfully.',
      data: accessData,
    };
  }

 
}
