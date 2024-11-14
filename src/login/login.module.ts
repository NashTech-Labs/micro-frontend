import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LoginService } from './login.service';
import { JwtStrategy } from './strategy/jwt.stratergy';
import { LoginController } from './login.controller';
import { accessLabelQueriesService } from 'src/accesslabels/accessQueries.service';
import { accessLabelService } from 'src/accesslabels/access.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Tenant from 'src/tenant/tenant.entity';
import { UserService } from 'src/user/user.service';
import { EmployeeQueriesService } from 'src/user/employeeQueries.service';
import { CompetencyQueriesService } from 'src/competency/competencyQueries.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant]),
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [LoginService, JwtStrategy, accessLabelQueriesService, accessLabelService,UserService,EmployeeQueriesService, CompetencyQueriesService],
  exports: [JwtModule],
  controllers: [LoginController],
})
export class LoginModule {}
