import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillController } from './skills.controller';
import { SkillService } from './skills.service';
import { SkillsQueriesService } from './skillsQueries.service'; // Add this line
import { Tenant } from '../tenant/tenant.entity';
import { accessLabelQueriesService } from 'src/accesslabels/accessQueries.service';
import { accessLabelService } from 'src/accesslabels/access.service';
import { LoginModule } from 'src/login/login.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant]),
  LoginModule],
  controllers: [SkillController],
  providers: [SkillService, SkillsQueriesService,accessLabelQueriesService, accessLabelService],
})
export class SkillModule {}
