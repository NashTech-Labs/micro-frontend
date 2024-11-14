import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectQueriesService } from './projectQueries.service'; // Add this line
import { Tenant } from '../tenant/tenant.entity';
import {UserService} from "../user/user.service"
import { EmployeeQueriesService } from '../user/employeeQueries.service';
import {CompetencyQueriesService} from "../competency/competencyQueries.service";
import { accessLabelService } from 'src/accesslabels/access.service';
import { accessLabelQueriesService } from 'src/accesslabels/accessQueries.service';
import { LoginModule } from 'src/login/login.module';


@Module({
  imports: [TypeOrmModule.forFeature([Tenant]), 
  LoginModule
 ],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectQueriesService, UserService, EmployeeQueriesService,CompetencyQueriesService,accessLabelService,accessLabelQueriesService], 
})
export class ProjectModule {}
