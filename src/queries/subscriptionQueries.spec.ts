import { getAllSubscription, createSubscription } from './subscriptionQueries';

describe('Database functions', () => {
  it('should retrieve all subscriptions', async () => {
    const tenantName = 'exampleTenant';
    const result = await getAllSubscription(tenantName);
    expect(result.message).toBe('Retrieved all subscription successfully.');
    expect(result.data).toBeDefined();
  });

  it('should create a subscription', async () => {
    const tenantName = 'exampleTenant';
    const subscriptionData = {
      planName: 'Test Plan',
      numberOfEmployees: 10,
      planDuration: '1 year',
      planDescription: 'Test plan description',
      price: 100,
    };
    const result = await createSubscription(tenantName, subscriptionData);
    expect(result.message).toBe(
      'Subscription created successfully and data saved.',
    );
    expect(result.data).toBeDefined();
  });

  it('should fail to create a subscription if plan name already exists', async () => {
    const tenantName = 'exampleTenant';
    const subscriptionData = {
      planName: 'Existing Plan',
      numberOfEmployees: 10,
      planDuration: '1 year',
      planDescription: 'Test plan description',
      price: 100,
    };
    const result = await createSubscription(tenantName, subscriptionData);
    expect(result.message).toBe(
      'Subscription with this name already exists. Please use another name.',
    );
    expect(result.data).toBeUndefined();
  });
});
