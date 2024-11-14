import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { fileQueriesService } from './fileQueries.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../tenant/tenant.entity';
import { UserService } from './../user/user.service';

@Injectable()
export class fileService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    private readonly fileQueriesService: fileQueriesService, // Inject the new service
    private readonly userService: UserService, // Inject the new service
  ) {}

  async uplaodFile(
    tenantCode: string,
    results: any,
  ): Promise<any> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantCode },
    });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    let nameTenant = tenant.tenant_name;
    let datas = [];
    let emp = [];
    if (results.length > 0) {
      for (let item = 0; item < results.length; item++) {
        let finalResult = await this.fileQueriesService.checkEmployee(
          nameTenant,
          results[item],
        );
        if (finalResult && finalResult.message) {
          datas.push({
            name: results[item].first_name,
            message: finalResult.message,
            email : finalResult.message == "User with this email already exists. Please use another email." ? results[item].email :  ""
          });
        }
      }
      if (datas.length > 0) {
        let errors = { datas };

        throw new BadRequestException(
          `Incorrect data for ${JSON.stringify(errors)} `,
        );
      } else {
        for (let item = 0; item < results.length; item++) {
          emp.push(
            await this.userService.createUser(tenantCode, results[item]),
          );
        }
      }
      if(emp.length >0){ 
        return emp
    }
    }
  }


}
