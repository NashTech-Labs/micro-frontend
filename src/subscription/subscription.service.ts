import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Not } from 'typeorm';
import { Subscription } from './subscription.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async createSubscription(
    userData: any,
  ): Promise<{ message: string; data?: any }> {
    const existingSubscription = await this.subscriptionRepository.query(
      `
            SELECT * FROM public.subscription
            WHERE "planName" = $1
        `,
      [userData.planName],
    );

    if (existingSubscription.length > 0) {
      return {
        message:
          'Subscription with this name already exists. Please use another name.',
      };
    }

    // Create raw query to insert subscription data
    const query = `INSERT INTO public.subscription ("planName", "numberOfEmployees", "planDuration", "planDescription", "price", "status")
        VALUES ($1, $2, $3, $4, $5, $6)`;

    try {
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

      return {
        message: 'Subscription created successfully and data saved.',
        data: subscriptionData,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to create subscription: ${error.message}`,
      );
    }
  }

  async subscriptionName(
    planName: string,
  ): Promise<{ message: string; data?: any }> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { planName: ILike(`%${planName}`) },
    });

    if (subscription) {
      return { message: 'Subscription already exists.'};
    }
  }

  async getSubscriptions(): Promise<{ message: string; data?: any }> {
    const result = await this.subscriptionRepository.find();
    return {
      message: 'Get All Subscription List Successfully .',
      data: result,
    };
  }

  async getSubscriptionById(
    id: number,
  ): Promise<{ message: string; data?: any }> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id: id },
    });

    if (!subscription) {
      throw new BadRequestException('Subscription not found');
    }

    return { message: 'Get Subscription Successfully .', data: subscription };
  }

  async updateSubscription(
    id: number,
    updateData: any,
  ): Promise<{ message: string; data?: any }> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
    });

    if (!subscription) {
      throw new BadRequestException('Subscription not found');
    }

    const duplicateSubscription = await this.subscriptionRepository.findOne({
      where: { planName: updateData.planName, id: Not(id) },
    });
  
    if (duplicateSubscription) {
      throw new BadRequestException('Plan name already exists.');
    }
    
    const query = `
          UPDATE public.subscription
          SET "planName" = $1, "numberOfEmployees" = $2, "planDuration" = $3, "planDescription" = $4, "price" = $5, "status" = $6, "updated_at" = CURRENT_TIMESTAMP
          WHERE id = $7
        `;

    try {
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

      return {
        message: 'Subscription updated successfully.',
        data: updatedSubscription,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to update subscription: ${error.message}`,
      );
    }
  }

  async deleteSubscription(id: number): Promise<{ message: string }> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
    });

    if (!subscription) {
      throw new BadRequestException('Subscription not found');
    }

    const query = `
          DELETE FROM public.subscription
          WHERE id = $1
        `;

    try {
      await this.subscriptionRepository.query(query, [id]);
      return { message: 'Subscription deleted successfully.' };
    } catch (error) {
      throw new BadRequestException(
        `Failed to delete subscription: ${error.message}`,
      );
    }
  }
}
