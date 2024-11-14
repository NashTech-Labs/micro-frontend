import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { employeeSkillController } from './competencySkill.controller';
import { employeeSkillService } from './competencySkill.service';
import { employeeSkillQueriesService } from './competencySkillQueries.service'; 
import { Tenant } from '../tenant/tenant.entity';
import { SkillsQueriesService } from '../Skills/skillsQueries.service';
import {EmployeeQueriesService} from "../user/employeeQueries.service" 
import {CompetencyService} from "./../competency/competency.service"
import {CompetencyQueriesService} from "./../competency/competencyQueries.service"
import { accessLabelService } from 'src/accesslabels/access.service';
import { accessLabelQueriesService } from 'src/accesslabels/accessQueries.service';
import { UserService } from 'src/user/user.service';
import { LoginModule } from 'src/login/login.module';




@Module({
  imports: [TypeOrmModule.forFeature([Tenant]),
  LoginModule
],
  controllers: [employeeSkillController],
  providers: [employeeSkillService, employeeSkillQueriesService,SkillsQueriesService,UserService, EmployeeQueriesService, CompetencyService, CompetencyQueriesService, accessLabelService, accessLabelQueriesService,] 
})
export class competencySkillModule {}