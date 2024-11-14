import { Pool, PoolClient } from 'pg';
import dbConfig from '../dbConfig.json';

interface TenantConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

function getTenantDbConfig(tenantName: string): TenantConfig | undefined {
  for (const tenant of dbConfig.tenants) {
    if (tenant.database.toLowerCase() === tenantName.toLowerCase()) {
      return tenant;
    }
  }
  return undefined;
}

async function executeQuery(
  tenantName: string,
  queryText: string,
  values?: any[],
): Promise<any> {
  const tenantDbConfig = getTenantDbConfig(tenantName);

  if (!tenantDbConfig) {
    throw new Error('Tenant database configuration not found.');
  }

  const pool = new Pool(tenantDbConfig);

  let client: PoolClient;
  try {
    client = await pool.connect();
    const result = await client.query(queryText, values);
    return result.rows;
  } catch (error) {
    throw new Error(`Failed to execute query: ${error.message}`);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end(); // Close the pool after executing the query
  }
}

export async function getAllSubscription(
  tenantName: string,
): Promise<{ message: string; data: any[] }> {
  const query = `
      SELECT * FROM public.subscription
    `;
  const subscription = await executeQuery(tenantName, query);
  return {
    message: 'Retrieved all subscription successfully.',
    data: subscription,
  };
}

export async function createSubscription(
  tenantName: string,
  subscriptionData: any,
): Promise<{ message: string; data?: any }> {
  const queryCheck = `
      SELECT * FROM public.subscription
      WHERE planName = $1
    `;
  const checkResult = await executeQuery(tenantName, queryCheck, [
    subscriptionData.planName,
  ]);

  if (checkResult.length > 0) {
    return {
      message:
        'Subscription with this name already exists. Please use another name.',
    };
  }

  const queryInsert = `
      INSERT INTO public.subscription (planName, numberOfEmployees, planDuration, planDescription, price)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

  const values: (string | number)[] = [
    subscriptionData.planName,
    subscriptionData.numberOfEmployees,
    subscriptionData.planDuration,
    subscriptionData.planDescription,
    subscriptionData.price,
  ];

  const insertResult = await executeQuery(tenantName, queryInsert, values);
  return {
    message: 'Subscription created successfully and data saved.',
    data: insertResult[0],
  };
}
