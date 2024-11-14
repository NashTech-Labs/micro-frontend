import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { Tenant } from '../tenant/tenant.entity';
import { Subscription } from './subscription.entity';
import { SubscriptionQueriesService } from './subscriptionQueries.service';
import { accessLabelQueriesService } from 'src/accesslabels/accessQueries.service';
import { accessLabelService } from 'src/accesslabels/access.service';
import { LoginModule } from 'src/login/login.module';



@Module({
  imports: [TypeOrmModule.forFeature([Tenant, Subscription]),
  LoginModule
],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SubscriptionQueriesService, accessLabelQueriesService, accessLabelService],
})
export class SubscriptionModule {}
