import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompetencyController } from './competency.controller';
import { CompetencyService } from './competency.service';
import { CompetencyQueriesService } from './competencyQueries.service'; // Add this line
import { Tenant } from '../tenant/tenant.entity';
import { UserService } from 'src/user/user.service';
import { EmployeeQueriesService } from 'src/user/employeeQueries.service';
import { LoginModule } from 'src/login/login.module';
import { accessLabelService } from 'src/accesslabels/access.service';
import { accessLabelQueriesService } from 'src/accesslabels/accessQueries.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant]),
  LoginModule
],
  controllers: [CompetencyController],
  providers: [CompetencyService, CompetencyQueriesService, EmployeeQueriesService, UserService, accessLabelService, accessLabelQueriesService], // Add CompetencyQueriesService here
})
export class CompetencyModule {}
