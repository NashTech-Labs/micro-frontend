import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Tenant } from '../tenant/tenant.entity';
import { EmployeeQueriesService } from './employeeQueries.service';
import {CompetencyService} from "./../competency/competency.service"
import {CompetencyQueriesService} from "./../competency/competencyQueries.service"
import { accessLabelService } from 'src/accesslabels/access.service';
import { accessLabelQueriesService } from 'src/accesslabels/accessQueries.service';
import { LoginModule } from 'src/login/login.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant]),
  LoginModule
  
],
  controllers: [UserController],
  providers: [UserService, EmployeeQueriesService, CompetencyService, CompetencyQueriesService, accessLabelService, accessLabelQueriesService],
})
export class UserModule {}
