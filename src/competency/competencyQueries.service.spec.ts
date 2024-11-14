import { CompetencyQueriesService } from './competencyQueries.service';

describe('CompetencyQueriesService', () => {
  let service: CompetencyQueriesService;

  const mockExecuteQuery = jest.fn();

  beforeEach(() => {
    service = new CompetencyQueriesService();
    service['executeQuery'] = mockExecuteQuery; // Mocking executeQuery method
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return database configuration for a valid tenant name', () => {
    const tenantName = 'test_tenant';
    const expectedConfig = {
      host: 'localhost',
      port: 5432,
      user: 'test_user',
      password: 'test_password',
      database: 'test_database',
    };

    const result = service['getTenantDbConfig'](tenantName);

    expect(result).toEqual(expectedConfig);
  });

  it('should return undefined for an invalid tenant name', () => {
    const tenantName = 'invalid_tenant';

    const result = service['getTenantDbConfig'](tenantName);

    expect(result).toBeUndefined();
  });

  describe('checkCompetencyName', () => {
    it('should return competencies with the same name', async () => {
      const tenantName = 'testTenant';
      const competencyName = 'Test Competency';
      const expectedQuery = `
        SELECT * FROM public.competency
        WHERE competency_name = $1
      `;
      const expectedValues = [competencyName];

      mockExecuteQuery.mockResolvedValueOnce([
        { id: 1, competency_name: competencyName },
      ]);

      const result = await service.checkCompetencyName(
        tenantName,
        competencyName,
      );

      expect(result).toEqual([{ id: 1, competency_name: competencyName }]);
      expect(mockExecuteQuery).toHaveBeenCalledWith(
        tenantName,
        expectedQuery,
        expectedValues,
      );
    });
  });

  describe('createCompetency', () => {
    it('should create a new competency', async () => {
      const tenantName = 'testTenant';
      const userData = {
        competency_name: 'New Competency',
        competency_admin_email: 'admin@example.com',
        status: 'active',
        total_project: 5,
        total_employee: 10,
        competency_head: 'Head of Competency',
        description: 'Description of Competency',
      };
      const code = 1234;
      const expectedQuery = `
        INSERT INTO public.competency (
          competency_name,
          competency_code,
          competency_admin_email,
          status,
          total_project,
          total_employee,
          competency_head,
          description,
          created_at,
          updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()
        )
      `;
      const expectedValues = [
        userData.competency_name,
        code,
        userData.competency_admin_email,
        userData.status,
        userData.total_project,
        userData.total_employee,
        userData.competency_head,
        userData.description,
      ];

      mockExecuteQuery.mockResolvedValueOnce(undefined);

      const result = await service.createCompetency(tenantName, userData, code);

      expect(result).toBeUndefined();
      expect(mockExecuteQuery).toHaveBeenCalledWith(
        tenantName,
        expectedQuery,
        expectedValues,
      );
    });
  });

  describe('getAllCompetencies', () => {
    it('should return all competencies', async () => {
      const tenantName = 'testTenant';
      const expectedQuery = `
        SELECT * FROM public.competency
      `;

      mockExecuteQuery.mockResolvedValueOnce([
        { id: 1, competency_name: 'Competency 1' },
        { id: 2, competency_name: 'Competency 2' },
      ]);

      const result = await service.getAllCompetencies(tenantName);

      expect(result).toEqual([
        { id: 1, competency_name: 'Competency 1' },
        { id: 2, competency_name: 'Competency 2' },
      ]);
      expect(mockExecuteQuery).toHaveBeenCalledWith(tenantName, expectedQuery);
    });
  });

  describe('getCompetencyById', () => {
    it('should return competency by ID', async () => {
      const tenantName = 'testTenant';
      const id = '1';
      const expectedQuery = `
        SELECT * FROM public.competency
        WHERE id = $1
      `;
      const expectedValues = [id];

      mockExecuteQuery.mockResolvedValueOnce([
        { id: 1, competency_name: 'Test Competency' },
      ]);

      const result = await service.getCompetencyById(tenantName, id);

      expect(result).toEqual([{ id: 1, competency_name: 'Test Competency' }]);
      expect(mockExecuteQuery).toHaveBeenCalledWith(
        tenantName,
        expectedQuery,
        expectedValues,
      );
    });
  });

  describe('updateCompetency', () => {
    it('should update a competency', async () => {
      const tenantName = 'testTenant';
      const id = '1';
      const userData = {
        competency_name: 'Updated Competency',
        competency_admin_email: 'admin_updated@example.com',
        status: 'inactive',
        total_project: 10,
        total_employee: 20,
        competency_head: 'Updated Head of Competency',
        description: 'Updated Description of Competency',
        image: 'image_url_updated',
      };
      const expectedQuery = `
        UPDATE public.competency
        SET
          competency_name = $1,
          competency_code = $2,
          competency_admin_email = $3,
          status = $4,
          total_project = $5,
          total_employee = $6,
          competency_head = $7,
          description = $8,
          image = $9,
          updated_at = NOW()
        WHERE id = $10
      `;
      const expectedValues = [
        userData.competency_name,
        // userData.competency_code,
        userData.competency_admin_email,
        userData.status,
        userData.total_project,
        userData.total_employee,
        userData.competency_head,
        userData.description,
        userData.image || '',
        id,
      ];

      mockExecuteQuery.mockResolvedValueOnce(undefined);

      const result = await service.updateCompetency(tenantName, id, userData);

      expect(result).toBeUndefined();
      expect(mockExecuteQuery).toHaveBeenCalledWith(
        tenantName,
        expectedQuery,
        expectedValues,
      );
    });
  });

  describe('deleteCompetency', () => {
    it('should delete a competency', async () => {
      const tenantName = 'testTenant';
      const id = '1';
      const expectedQuery = `
        DELETE FROM public.competency
        WHERE id = $1
      `;
      const expectedValues = [id];

      mockExecuteQuery.mockResolvedValueOnce(undefined);

      const result = await service.deleteCompetency(tenantName, id);

      expect(result).toBeUndefined();
      expect(mockExecuteQuery).toHaveBeenCalledWith(
        tenantName,
        expectedQuery,
        expectedValues,
      );
    });
  });
});
