import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from './subscription.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionQueriesService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async createSubscription(userData: any): Promise<any> {
    // Create raw query to insert subscription data
    const query = `INSERT INTO public.subscription ("planName", "numberOfEmployees", "planDuration", "planDescription", "price", "status")
        VALUES ($1, $2, $3, $4, $5, $6)`;

    await this.subscriptionRepository.query(query, [
      userData.planName,
      userData.numberOfEmployees,
      userData.planDuration,
      userData.planDescription,
      userData.price,
      userData.status,
    ]);
    const subscriptionData = await this.subscriptionRepository.query(
      `
                SELECT * FROM public.subscription
                WHERE "planName" = $1
            `,
      [userData.planName],
    );

    return subscriptionData;
  }

  async subscriptionName(planName: string): Promise<any> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { planName },
    });
    return subscription;
  }

  async getSubscriptionById(id: number): Promise<any> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
    });
    return subscription;
  }

  async getSubscriptions(): Promise<any> {
    const result = await this.subscriptionRepository.find();
    return result;
  }

  async updateSubscription(id: number, updateData: any): Promise<any> {
    const query = `
          UPDATE public.subscription
          SET "planName" = $1, "numberOfEmployees" = $2, "planDuration" = $3, "planDescription" = $4, "price" = $5, "status" = $6, "updated_at" = CURRENT_TIMESTAMP
          WHERE id = $7
        `;

    await this.subscriptionRepository.query(query, [
      updateData.planName,
      updateData.numberOfEmployees,
      updateData.planDuration,
      updateData.planDescription,
      updateData.price,
      updateData.status,
      id,
    ]);
    const updatedSubscription = await this.subscriptionRepository.findOne({
      where: { id },
    });

    return updatedSubscription;
  }

  async deleteSubscription(id: number): Promise<any> {
    const query = `
      DELETE FROM public.subscription
      WHERE id = $1
    `;
    await this.subscriptionRepository.query(query, [id]);
    return { message: 'Subscription deleted successfully.' };
  }
}
