import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from './subscription.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tenant } from '../tenant/tenant.entity';
import { Subscription } from './subscription.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let tenantRepository: Repository<Tenant>;
  let subscriptionRepository: Repository<Subscription>;

  const mockTenantRepository = {
    findOne: jest.fn(),
  };

  const mockSubscriptionRepository = {
    query: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        {
          provide: getRepositoryToken(Tenant),
          useValue: mockTenantRepository,
        },
        {
          provide: getRepositoryToken(Subscription),
          useValue: mockSubscriptionRepository,
        },
      ],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
    tenantRepository = module.get<Repository<Tenant>>(
      getRepositoryToken(Tenant),
    );
    subscriptionRepository = module.get<Repository<Subscription>>(
      getRepositoryToken(Subscription),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSubscription', () => {
    it('should throw BadRequestException if data is invalid', async () => {
      const invalidData = { planName: '', planDescription: '' };

      await expect(service.createSubscription(invalidData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return message if subscription name already exists', async () => {
      const existingSubscription = [{ id: 1, planName: 'test' }];
      mockSubscriptionRepository.query.mockResolvedValue(existingSubscription);

      const result = await service.createSubscription({
        planName: 'test',
        planDescription: 'desc',
        numberOfEmployees: 10,
        planDuration: 12,
        status: 'active',
        price: 100,
      });

      expect(result).toEqual({
        message:
          'Subscription with this name already exists. Please use another name.',
      });
    });

    it('should create a subscription and return data', async () => {
      const newSubscriptionData = {
        planName: 'test',
        planDescription: 'desc',
        numberOfEmployees: 10,
        planDuration: 12,
        status: 'active',
        price: 100,
      };
      mockSubscriptionRepository.query.mockResolvedValueOnce([]);
      mockSubscriptionRepository.query.mockResolvedValueOnce(undefined);
      mockSubscriptionRepository.query.mockResolvedValueOnce([
        newSubscriptionData,
      ]);

      const result = await service.createSubscription(newSubscriptionData);

      expect(result).toEqual({
        message: 'Subscription created successfully and data saved.',
        data: [newSubscriptionData],
      });
    });
  });

  describe('subscriptionName', () => {
    it('should throw BadRequestException if data is invalid', async () => {
      const invalidData = { planName: '' };

      await expect(
        service.subscriptionName(invalidData.planName),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw Error if subscription is not found', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue(null);

      await expect(service.subscriptionName('test')).rejects.toThrow(Error);
    });

    it('should return subscription data if found', async () => {
      const subscriptionData = { id: 1, planName: 'test' };
      mockSubscriptionRepository.findOne.mockResolvedValue(subscriptionData);

      const result = await service.subscriptionName('test');

      expect(result).toEqual({
        message: 'Get Subscription Successfully .',
        data: subscriptionData,
      });
    });
  });

  describe('getSubscriptions', () => {
    it('should return all subscriptions', async () => {
      const subscriptionData = [{ id: 1, planName: 'test' }];
      mockSubscriptionRepository.find.mockResolvedValue(subscriptionData);

      const result = await service.getSubscriptions();

      expect(result).toEqual({
        message: 'Get All Subscription List Successfully .',
        data: subscriptionData,
      });
    });
  });

  describe('getSubscriptionById', () => {
    it('should throw BadRequestException if id is invalid', async () => {
      await expect(
        service.getSubscriptionById('invalid' as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw Error if subscription is not found', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue(null);

      await expect(service.getSubscriptionById(1)).rejects.toThrow(Error);
    });

    it('should return subscription data if found', async () => {
      const subscriptionData = { id: 1, planName: 'test' };
      mockSubscriptionRepository.findOne.mockResolvedValue(subscriptionData);

      const result = await service.getSubscriptionById(1);

      expect(result).toEqual({
        message: 'Get Subscription Successfully .',
        data: subscriptionData,
      });
    });
  });

  describe('updateSubscription', () => {
    it('should throw BadRequestException if data is invalid', async () => {
      const invalidData = { planName: '' };

      await expect(service.updateSubscription(1, invalidData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw Error if subscription is not found', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateSubscription(1, { planName: 'test' }),
      ).rejects.toThrow(Error);
    });

    it('should update subscription and return updated data', async () => {
      const existingSubscription = { id: 1, planName: 'test' };
      const updatedData = {
        planName: 'test',
        planDescription: 'desc',
        numberOfEmployees: 10,
        planDuration: 12,
        status: 'active',
        price: 100,
      };
      mockSubscriptionRepository.findOne.mockResolvedValue(
        existingSubscription,
      );
      mockSubscriptionRepository.query.mockResolvedValueOnce(undefined);
      mockSubscriptionRepository.findOne.mockResolvedValueOnce(updatedData);

      const result = await service.updateSubscription(1, updatedData);

      expect(result).toEqual({
        message: 'Subscription updated successfully.',
        data: updatedData,
      });
    });
  });

  describe('deleteSubscription', () => {
    it('should throw BadRequestException if id is invalid', async () => {
      await expect(
        service.deleteSubscription('invalid' as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw Error if subscription is not found', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteSubscription(1)).rejects.toThrow(Error);
    });

    it('should delete subscription and return success message', async () => {
      const existingSubscription = { id: 1, planName: 'test' };
      mockSubscriptionRepository.findOne.mockResolvedValue(
        existingSubscription,
      );
      mockSubscriptionRepository.query.mockResolvedValueOnce(undefined);

      const result = await service.deleteSubscription(1);

      expect(result).toEqual({
        message: 'Subscription deleted successfully.',
      });
    });
  });
});
