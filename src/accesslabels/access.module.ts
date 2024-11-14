import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { accessLabelQueriesService } from './accessQueries.service';
import { Tenant } from '../tenant/tenant.entity';
import { accessLabelService } from './access.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  controllers: [],
  providers: [accessLabelQueriesService, accessLabelService],
})
export class AccessLabelsModule {}
