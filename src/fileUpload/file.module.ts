import { Module } from '@nestjs/common';
import { FilesController } from './file.controller';
import {UserService} from "./../user/user.service"
import { TypeOrmModule } from '@nestjs/typeorm';
import Tenant from 'src/tenant/tenant.entity';
import { EmployeeQueriesService } from 'src/user/employeeQueries.service';
import {CompetencyService} from "./../competency/competency.service"
import {CompetencyQueriesService} from "./../competency/competencyQueries.service"
import { fileQueriesService } from './fileQueries.service';
import { fileService } from './file.services';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LoginService } from './../login/login.service';
import { JwtStrategy } from './../login/strategy/jwt.stratergy';
import { LoginController } from './../login/login.controller';
import { accessLabelService } from 'src/accesslabels/access.service';
import { accessLabelQueriesService } from 'src/accesslabels/accessQueries.service';
import { LoginModule } from 'src/login/login.module';


@Module({
  imports: [TypeOrmModule.forFeature([Tenant]), LoginModule],

    controllers: [FilesController],
    providers: [UserService, EmployeeQueriesService, CompetencyQueriesService, CompetencyService, fileQueriesService, fileService,accessLabelService,accessLabelQueriesService]  })
export class FileModule {}
