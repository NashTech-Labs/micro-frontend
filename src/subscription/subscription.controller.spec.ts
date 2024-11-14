import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';

describe('SubscriptionController', () => {
  let controller: SubscriptionController;
  let service: SubscriptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionController],
      providers: [
        {
          provide: SubscriptionService,
          useValue: {
            createSubscription: jest.fn(),
            subscriptionName: jest.fn(),
            getSubscriptions: jest.fn(),
            getSubscriptionById: jest.fn(),
            updateSubscription: jest.fn(),
            deleteSubscription: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SubscriptionController>(SubscriptionController);
    service = module.get<SubscriptionService>(SubscriptionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call createSubscription method', async () => {
    const createSubscriptionSpy = jest.spyOn(service, 'createSubscription');
    const userData = { name: 'Test User' };
    await controller.createSubscription({} as any, userData);
    expect(createSubscriptionSpy).toHaveBeenCalledWith(userData);
  });

  it('should call subscriptionName method', async () => {
    const subscriptionNameSpy = jest.spyOn(service, 'subscriptionName');
    const planName = 'Basic';
    await controller.subscriptionName({} as any, planName);
    expect(subscriptionNameSpy).toHaveBeenCalledWith(planName);
  });

  it('should call getSubscriptions method', async () => {
    const getSubscriptionsSpy = jest.spyOn(service, 'getSubscriptions');
    await controller.getSubscriptions({} as any);
    expect(getSubscriptionsSpy).toHaveBeenCalled();
  });

  it('should call getSubscriptionById method', async () => {
    const getSubscriptionByIdSpy = jest.spyOn(service, 'getSubscriptionById');
    const id = 1;
    await controller.getSubscriptionById({} as any, id);
    expect(getSubscriptionByIdSpy).toHaveBeenCalledWith(id);
  });

  it('should call updateSubscription method', async () => {
    const updateSubscriptionSpy = jest.spyOn(service, 'updateSubscription');
    const id = 1;
    const updateData = { name: 'Updated User' };
    await controller.updateSubscription({} as any, id, updateData);
    expect(updateSubscriptionSpy).toHaveBeenCalledWith(id, updateData);
  });

  it('should call deleteSubscription method', async () => {
    const deleteSubscriptionSpy = jest.spyOn(service, 'deleteSubscription');
    const id = 1;
    await controller.deleteSubscription({} as any, id);
    expect(deleteSubscriptionSpy).toHaveBeenCalledWith(id);
  });
});
