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
    console.error('Error executing query:', error);
    throw new Error(`Failed to execute query: ${error.message}`);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end(); // Close the pool after executing the query
  }
}

export async function getAllEmployees(
  tenantName: string,
): Promise<{ message: string; data: any[] }> {
  const query = `
    SELECT * FROM public.employee
  `;
  const employees = await executeQuery(tenantName, query);
  return { message: 'Retrieved all employees successfully.', data: employees };
}

export async function getAllDesignations(
  tenantName: string,
): Promise<{ message: string; data: any[] }> {
  const query = `
  SELECT * FROM public.designation
`;

  const designation = await executeQuery(tenantName, query);
  if (designation.length > 0) {
    return {
      message: 'Retrieved all designation successfully.',
      data: designation,
    };
  }

  const list = [
    'intern',
    'Software Consultant',
    'Senior Software Consultant',
    'AVP',
    'VP',
  ];

  list.map(async (item) => {
    const queryInsert = `
    INSERT INTO public.designation (title,created_at, updated_at)
    VALUES ($1, NOW(), NOW())
    RETURNING *;
  `;

    const values: (string | number)[] = [item];

    await executeQuery(tenantName, queryInsert, values);
  });

  return {
    message: 'Retrieved all designation successfully.',
    data: designation,
  };
}

export async function createEmployee(
  tenantName: string,
  employeeData: any,
): Promise<{ message: string; data?: any }> {
  const queryCheck = `
    SELECT * FROM public.employee
    WHERE email = $1
  `;
  const checkResult = await executeQuery(tenantName, queryCheck, [
    employeeData.email,
  ]);

  if (checkResult.length > 0) {
    return {
      message: 'User with this email already exists. Please use another email.',
    };
  }

  const queryInsert = `
    INSERT INTO public.employee (first_name, designation, role, gender, email, password, studio_name, tenant_id, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
    RETURNING *;
  `;

  const values: (string | number)[] = [
    employeeData.first_name,
    employeeData.designation,
    employeeData.role,
    employeeData.gender,
    employeeData.email,
    employeeData.password,
    employeeData.studio_name,
    employeeData.tenant_id,
  ];

  const insertResult = await executeQuery(tenantName, queryInsert, values);
  insertResult[0]['tenant_code'] = employeeData.tenant_code;
  return {
    message: 'User created successfully and data saved.',
    data: insertResult[0],
  };
}

export async function filterUsersByName(
  tenantName: string,
  name: string,
): Promise<{ message: string; data?: any[] }> {
  if (name) {
    const query = `
    SELECT * FROM public.employee WHERE first_name LIKE '${name}%'
  `;
    const users = await executeQuery(tenantName, query);

    const filteredUsers = users.map((user: any) => ({
      id: user.id,
      first_name: user.first_name,
      designation: user.designation,
      email: user.email,
      studio: user.studio_name,
      image: user.image,
    }));

    return { message: 'Users filtered successfully.', data: filteredUsers };
  } else {
    return { message: 'Please provide valid name to retrieve a user.' };
  }
}

export async function getEmployeeByEmail(
  tenantName: string,
  email: string,
): Promise<any[]> {
  const query = 'SELECT * FROM employee WHERE email = $1';
  return await executeQuery(tenantName, query, [email]);
}
