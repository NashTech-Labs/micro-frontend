import {
  getAllEmployees,
  getAllDesignations,
  createEmployee,
  filterUsersByName,
  getEmployeeByEmail,
} from './employeeQueries';

describe('Database functions', () => {
  it('should retrieve all employees', async () => {
    const tenantName = 'exampleTenant';
    const result = await getAllEmployees(tenantName);
    expect(result.message).toBe('Retrieved all employees successfully.');
    expect(result.data).toBeDefined();
  });

  it('should retrieve all designations', async () => {
    const tenantName = 'exampleTenant';
    const result = await getAllDesignations(tenantName);
    expect(result.message).toBe('Retrieved all designation successfully.');
    expect(result.data).toBeDefined();
  });

  it('should create an employee', async () => {
    const tenantName = 'exampleTenant';
    const employeeData = {
      first_name: 'John',
      designation: 'Software Consultant',
      role: 'Developer',
      gender: 'Male',
      email: 'john@example.com',
      password: 'password',
      studio_name: 'Studio A',
      tenant_id: 12345,
      tenant_code: 'TNT123',
    };
    const result = await createEmployee(tenantName, employeeData);
    expect(result.message).toBe('User created successfully and data saved.');
    expect(result.data).toBeDefined();
  });

  it('should filter users by name', async () => {
    const tenantName = 'exampleTenant';
    const name = 'John';
    const result = await filterUsersByName(tenantName, name);
    expect(result.message).toBe('Users filtered successfully.');
    expect(result.data).toBeDefined();
  });

  it('should return an error message when no name is provided for filtering', async () => {
    const tenantName = 'exampleTenant';
    const name = '';
    const result = await filterUsersByName(tenantName, name);
    expect(result.message).toBe(
      'Please provide valid name to retrieve a user.',
    );
    expect(result.data).toBeUndefined();
  });

  it('should retrieve an employee by email', async () => {
    const tenantName = 'exampleTenant';
    const email = 'john@example.com';
    const result = await getEmployeeByEmail(tenantName, email);
    expect(result).toBeDefined();
  });
});
