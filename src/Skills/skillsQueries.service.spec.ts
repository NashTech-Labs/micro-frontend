import { SkillsQueriesService } from './skillsQueries.service';

describe('SkillsQueriesService', () => {
  let service: SkillsQueriesService;

  beforeEach(() => {
    service = new SkillsQueriesService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkSkillName', () => {
    it('should return skills when skill name exists', async () => {
      const tenantName = 'TestTenant';
      const competencyName = 'TestSkill';
      const expectedResult = [{ skill_name: competencyName }];

      // Mock the private method executeQuery
      const executeQueryMock = jest.spyOn(service as any, 'executeQuery');
      executeQueryMock.mockResolvedValue(expectedResult);

      const result = await service.checkSkillName(tenantName, competencyName);

      expect(result).toEqual(expectedResult);
      expect(executeQueryMock).toHaveBeenCalledWith(
        tenantName,
        expect.any(String),
        [competencyName]
      );
    });

    it('should return an empty array when skill name does not exist', async () => {
      const tenantName = 'TestTenant';
      const competencyName = 'NonExistentSkill';
      const expectedResult = [];

      // Mock the private method executeQuery
      const executeQueryMock = jest.spyOn(service as any, 'executeQuery');
      executeQueryMock.mockResolvedValue(expectedResult);

      const result = await service.checkSkillName(tenantName, competencyName);

      expect(result).toEqual(expectedResult);
      expect(executeQueryMock).toHaveBeenCalledWith(
        tenantName,
        expect.any(String),
        [competencyName]
      );
    });

    it('should throw an error when tenant database config is not found', async () => {
      const tenantName = 'NonExistentTenant';
      const competencyName = 'TestSkill';

      await expect(service.checkSkillName(tenantName, competencyName)).rejects.toThrowError(
        'Tenant database configuration not found.'
      );
    });

    it('should throw an error when executeQuery fails', async () => {
      const tenantName = 'TestTenant';
      const competencyName = 'TestSkill';
      const errorMessage = 'Error executing query';

      // Mock the private method executeQuery to simulate failure
      const executeQueryMock = jest.spyOn(service as any, 'executeQuery');
      executeQueryMock.mockRejectedValue(new Error(errorMessage));

      await expect(service.checkSkillName(tenantName, competencyName)).rejects.toThrowError(
        `${errorMessage}`
      );
    });
  });

  describe('createSkill', () => {
    it('should create a skill', async () => {
      const tenantName = 'TestTenant';
      const userData = {
        skill_name: 'NewSkill',
      };
      const expectedResult = {};

      // Mock the private method executeQuery
      const executeQueryMock = jest.spyOn(service as any, 'executeQuery');
      executeQueryMock.mockResolvedValue(expectedResult);

      const result = await service.createSkill(tenantName, userData);

      expect(result).toEqual(expectedResult);
      expect(executeQueryMock).toHaveBeenCalledWith(
        tenantName,
        expect.any(String),
        [userData.skill_name]
      );
    });

    it('should throw an error when tenant database config is not found', async () => {
      const tenantName = 'NonExistentTenant';
      const userData = {
        skill_name: 'NewSkill',
      };

      await expect(service.createSkill(tenantName, userData)).rejects.toThrowError(
        'Tenant database configuration not found.'
      );
    });

    it('should throw an error when executeQuery fails', async () => {
      const tenantName = 'TestTenant';
      const userData = {
        skill_name: 'NewSkill',
      };
      const errorMessage = 'Error executing query';

      // Mock the private method executeQuery to simulate failure
      const executeQueryMock = jest.spyOn(service as any, 'executeQuery');
      executeQueryMock.mockRejectedValue(new Error(errorMessage));

      await expect(service.createSkill(tenantName, userData)).rejects.toThrowError(
        `${errorMessage}`
      );
    });
  });

  describe('getAllSkills', () => {
    it('should return all skills', async () => {
      const tenantName = 'TestTenant';
      const expectedResult = [{ id: 1, skill_name: 'Skill1' }, { id: 2, skill_name: 'Skill2' }];

      // Mock the private method executeQuery
      const executeQueryMock = jest.spyOn(service as any, 'executeQuery');
      executeQueryMock.mockResolvedValue(expectedResult);

      const result = await service.getAllSkills(tenantName);

      expect(result).toEqual(expectedResult);
     
    });

    it('should throw an error when tenant database config is not found', async () => {
      const tenantName = 'NonExistentTenant';

      await expect(service.getAllSkills(tenantName)).rejects.toThrowError(
        'Tenant database configuration not found.'
      );
    });

    it('should throw an error when executeQuery fails', async () => {
      const tenantName = 'TestTenant';
      const errorMessage = 'Error executing query';

      // Mock the private method executeQuery to simulate failure
      const executeQueryMock = jest.spyOn(service as any, 'executeQuery');
      executeQueryMock.mockRejectedValue(new Error(errorMessage));

      await expect(service.getAllSkills(tenantName)).rejects.toThrowError(
        `${errorMessage}`
      );
    });
  });

  describe('getSkillById', () => {
    it('should return skill by id', async () => {
      const tenantName = 'TestTenant';
      const id = '1';
      const expectedResult = [{ id: 1, skill_name: 'Skill1' }];

      // Mock the private method executeQuery
      const executeQueryMock = jest.spyOn(service as any, 'executeQuery');
      executeQueryMock.mockResolvedValue(expectedResult);

      const result = await service.getSkillById(tenantName, id);

      expect(result).toEqual(expectedResult);
      expect(executeQueryMock).toHaveBeenCalledWith(
        tenantName,
        expect.any(String),
        [id]
      );
    });

    it('should throw an error when tenant database config is not found', async () => {
      const tenantName = 'NonExistentTenant';
      const id = '1';

      await expect(service.getSkillById(tenantName, id)).rejects.toThrowError(
        'Tenant database configuration not found.'
      );
    });

    it('should throw an error when executeQuery fails', async () => {
      const tenantName = 'TestTenant';
      const id = '1';
      const errorMessage = 'Error executing query';

      // Mock the private method executeQuery to simulate failure
      const executeQueryMock = jest.spyOn(service as any, 'executeQuery');
      executeQueryMock.mockRejectedValue(new Error(errorMessage));

      await expect(service.getSkillById(tenantName, id)).rejects.toThrowError(
        `${errorMessage}`
      );
    });
  });
});
