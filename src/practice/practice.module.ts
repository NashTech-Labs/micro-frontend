import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PracticeController } from './practice.controller';
import { PracticeService } from './practice.service';
import { PracticeQueriesService } from './practiceQueries.service';
import { Tenant } from '../tenant/tenant.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LoginService } from './../login/login.service';
import { JwtStrategy } from './../login/strategy/jwt.stratergy';
import { LoginController } from './../login/login.controller';
import { accessLabelQueriesService } from 'src/accesslabels/accessQueries.service';
import { accessLabelService } from 'src/accesslabels/access.service';
import { LoginModule } from 'src/login/login.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant]),
  LoginModule
],
  controllers: [PracticeController],
  providers: [PracticeService, PracticeQueriesService, accessLabelQueriesService, accessLabelService],
})
export class PracticeModule {}
