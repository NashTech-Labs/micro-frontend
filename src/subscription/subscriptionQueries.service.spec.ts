import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionQueriesService } from './subscriptionQueries.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Subscription } from './subscription.entity';
import { Repository } from 'typeorm';

describe('SubscriptionQueriesService', () => {
  let service: SubscriptionQueriesService;
  let subscriptionRepository: Repository<Subscription>;

  const mockSubscriptionRepository = {
    query: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionQueriesService,
        {
          provide: getRepositoryToken(Subscription),
          useValue: mockSubscriptionRepository,
        },
      ],
    }).compile();

    service = module.get<SubscriptionQueriesService>(
      SubscriptionQueriesService,
    );
    subscriptionRepository = module.get<Repository<Subscription>>(
      getRepositoryToken(Subscription),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSubscription', () => {
    it('should create a subscription and return data', async () => {
      const newSubscriptionData = {
        planName: 'test',
        planDescription: 'desc',
        numberOfEmployees: 10,
        planDuration: 12,
        status: 'active',
        price: 100,
      };
      mockSubscriptionRepository.query.mockResolvedValueOnce(undefined);
      mockSubscriptionRepository.query.mockResolvedValueOnce([
        newSubscriptionData,
      ]);

      const result = await service.createSubscription(newSubscriptionData);

      expect(result).toEqual([newSubscriptionData]);
      expect(mockSubscriptionRepository.query).toHaveBeenCalledTimes(2);
    });
  });

  describe('subscriptionName', () => {
    it('should return subscription data if found', async () => {
      const subscriptionData = { id: 1, planName: 'test' };
      mockSubscriptionRepository.findOne.mockResolvedValue(subscriptionData);

      const result = await service.subscriptionName('test');

      expect(result).toEqual(subscriptionData);
      expect(mockSubscriptionRepository.findOne).toHaveBeenCalledWith({
        where: { planName: 'test' },
      });
    });
  });

  describe('getSubscriptionById', () => {
    it('should return subscription data if found', async () => {
      const subscriptionData = { id: 1, planName: 'test' };
      mockSubscriptionRepository.findOne.mockResolvedValue(subscriptionData);

      const result = await service.getSubscriptionById(1);

      expect(result).toEqual(subscriptionData);
      expect(mockSubscriptionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('getSubscriptions', () => {
    it('should return all subscriptions', async () => {
      const subscriptionData = [{ id: 1, planName: 'test' }];
      mockSubscriptionRepository.find.mockResolvedValue(subscriptionData);

      const result = await service.getSubscriptions();

      expect(result).toEqual(subscriptionData);
      expect(mockSubscriptionRepository.find).toHaveBeenCalled();
    });
  });

  describe('updateSubscription', () => {
    it('should update subscription and return updated data', async () => {
      const existingSubscription = { id: 1, planName: 'test' };
      const updatedData = {
        planName: 'test updated',
        planDescription: 'desc updated',
        numberOfEmployees: 20,
        planDuration: 24,
        status: 'inactive',
        price: 200,
      };
      mockSubscriptionRepository.query.mockResolvedValueOnce(undefined);
      mockSubscriptionRepository.findOne.mockResolvedValueOnce(updatedData);

      const result = await service.updateSubscription(1, updatedData);

      expect(result).toEqual(updatedData);
      expect(mockSubscriptionRepository.query).toHaveBeenCalledWith(
        expect.any(String),
        [
          updatedData.planName,
          updatedData.numberOfEmployees,
          updatedData.planDuration,
          updatedData.planDescription,
          updatedData.price,
          updatedData.status,
          1,
        ],
      );
      expect(mockSubscriptionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('deleteSubscription', () => {
    it('should delete subscription and return success message', async () => {
      const result = await service.deleteSubscription(1);

      expect(result).toEqual({ message: 'Subscription deleted successfully.' });
      expect(mockSubscriptionRepository.query).toHaveBeenCalledWith(
        expect.any(String),
        [1],
      );
    });
  });
});
