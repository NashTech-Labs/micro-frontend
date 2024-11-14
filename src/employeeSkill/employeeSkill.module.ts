import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { employeeSkillController } from './employeeSkill.controller';
import { employeeSkillService } from './employeeSkill.service';
import { employeeSkillQueriesService } from './employeeSkillQueries.service'; 
import { Tenant } from '../tenant/tenant.entity';
import { SkillsQueriesService } from './../Skills/skillsQueries.service';
import {EmployeeQueriesService} from "./../user/employeeQueries.service" 
import {CompetencyService} from "./../competency/competency.service"
import {CompetencyQueriesService} from "./../competency/competencyQueries.service" 
import { accessLabelQueriesService } from 'src/accesslabels/accessQueries.service';
import { accessLabelService } from 'src/accesslabels/access.service';
import { UserService } from 'src/user/user.service';
import { LoginModule } from 'src/login/login.module';




@Module({
  imports: [TypeOrmModule.forFeature([Tenant]), 
  LoginModule
],
  controllers: [employeeSkillController],
  providers: [employeeSkillService, employeeSkillQueriesService,SkillsQueriesService, EmployeeQueriesService,UserService, CompetencyService, CompetencyQueriesService, accessLabelQueriesService,accessLabelService],
})
export class employeeSkillModule {}