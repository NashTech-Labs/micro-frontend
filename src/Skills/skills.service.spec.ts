import { Test, TestingModule } from '@nestjs/testing';
import { SkillService } from './skills.service';
import { SkillsQueriesService } from './skillsQueries.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Tenant } from '../tenant/tenant.entity';

describe('SkillService', () => {
  let service: SkillService;
  let skillsQueriesService: SkillsQueriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillService,
        {
          provide: 'TenantRepository',
          useClass: Repository,
        },
        {
          provide: SkillsQueriesService,
          useValue: {
            checkSkillName: jest.fn(),
            createSkill: jest.fn(),
            getAllSkills: jest.fn(),
            getSkillById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SkillService>(SkillService);
    skillsQueriesService = module.get<SkillsQueriesService>(SkillsQueriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createSkill', () => {
    it('should create a new skill', async () => {
      const tenantCode = 'testTenant';
      const userData = { skill_name: 'New Skill' };

      jest.spyOn(service['tenantRepository'], 'findOne').mockResolvedValueOnce({
        tenant_code: tenantCode,
        tenant_name: 'Test Tenant',
      } as Tenant);

      (skillsQueriesService.checkSkillName as jest.Mock).mockResolvedValueOnce([]);

      const result = await service.createSkill(tenantCode, userData);

      expect(result.message).toEqual('skill created successfully and data saved.');
      expect(skillsQueriesService.createSkill).toHaveBeenCalledWith('Test Tenant', userData);
    });

    it('should throw NotFoundException if tenant is not found', async () => {
      const tenantCode = 'nonExistingTenant';
      const userData = { skill_name: 'New Skill' };

      jest.spyOn(service['tenantRepository'], 'findOne').mockResolvedValueOnce(undefined);

      await expect(service.createSkill(tenantCode, userData)).rejects.toThrowError(NotFoundException);
    });

    it('should throw BadRequestException if skill with the same name exists', async () => {
      const tenantCode = 'testTenant';
      const userData = { skill_name: 'Existing Skill' };

      jest.spyOn(service['tenantRepository'], 'findOne').mockResolvedValueOnce({
        tenant_code: tenantCode,
        tenant_name: 'Test Tenant',
      } as Tenant);

      (skillsQueriesService.checkSkillName as jest.Mock).mockResolvedValueOnce([{}]);

      await expect(service.createSkill(tenantCode, userData)).rejects.toThrowError(BadRequestException);
    });
  });

  describe('skillName', () => {
    it('should return message that skill name can be created', async () => {
      const tenantCode = 'testTenant';
      const userData = { skill_name: 'New Skill' };

      jest.spyOn(service['tenantRepository'], 'findOne').mockResolvedValueOnce({
        tenant_code: tenantCode,
        tenant_name: 'Test Tenant',
      } as Tenant);

      (skillsQueriesService.checkSkillName as jest.Mock).mockResolvedValueOnce([]);

      const result = await service.skillName(tenantCode, userData);

      expect(result.message).toEqual('Skill with this name can be created');
    });

  

    // it('should throw BadRequestException if skill name is empty', async () => {
    //   const tenantCode = 'testTenant';
    //   const userData = { skill_name: '' };

    //   await expect(service.skillName(tenantCode, userData)).rejects.toThrowError(BadRequestException);
    // });

    it('should throw BadRequestException if skill with the same name exists', async () => {
      const tenantCode = 'testTenant';
      const userData = { skill_name: 'Existing Skill' };

      jest.spyOn(service['tenantRepository'], 'findOne').mockResolvedValueOnce({
        tenant_code: tenantCode,
        tenant_name: 'Test Tenant',
      } as Tenant);

      (skillsQueriesService.checkSkillName as jest.Mock).mockResolvedValueOnce([{}]);

      await expect(service.skillName(tenantCode, userData)).rejects.toThrowError(BadRequestException);
    });

    it('should throw NotFoundException if tenant is not found', async () => {
      const tenantCode = 'nonExistingTenant';
      const userData = { skill_name: 'New Skill' };

      jest.spyOn(service['tenantRepository'], 'findOne').mockResolvedValueOnce(undefined);

      await expect(service.skillName(tenantCode, userData)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('getAllSkills', () => {
    it('should retrieve all skills successfully', async () => {
      const tenantCode = 'testTenant';

      jest.spyOn(service['tenantRepository'], 'findOne').mockResolvedValueOnce({
        tenant_code: tenantCode,
        tenant_name: 'Test Tenant',
      } as Tenant);

      const mockSkillsData = [{ id: '1', name: 'Skill 1' }, { id: '2', name: 'Skill 2' }];

      (skillsQueriesService.getAllSkills as jest.Mock).mockResolvedValueOnce(mockSkillsData);

      const result = await service.getAllSkills(tenantCode);

      expect(result.message).toEqual('Retrieved all skills successfully.');
      expect(result.data).toEqual(mockSkillsData);
    });

    it('should return empty array if no skills are found', async () => {
      const tenantCode = 'testTenant';

      jest.spyOn(service['tenantRepository'], 'findOne').mockResolvedValueOnce({
        tenant_code: tenantCode,
        tenant_name: 'Test Tenant',
      } as Tenant);

      (skillsQueriesService.getAllSkills as jest.Mock).mockResolvedValueOnce([]);

      const result = await service.getAllSkills(tenantCode);

      expect(result.message).toEqual('Retrieved all skills successfully.');
      expect(result.data).toEqual([]);
    });

    it('should throw NotFoundException if tenant is not found', async () => {
      const tenantCode = 'nonExistingTenant';

      jest.spyOn(service['tenantRepository'], 'findOne').mockResolvedValueOnce(undefined);

      await expect(service.getAllSkills(tenantCode)).rejects.toThrowError(NotFoundException);
    });

    // it('should throw internal server error if skills retrieval fails', async () => {
    //   const tenantCode = 'testTenant';

    //   jest.spyOn(service['tenantRepository'], 'findOne').mockResolvedValueOnce({
    //     tenant_code: tenantCode,
    //     tenant_name: 'Test Tenant',
    //   } as Tenant);

    //   (skillsQueriesService.getAllSkills as jest.Mock).mockRejectedValueOnce(new Error('Database connection failed'));

    //   await expect(service.getAllSkills(tenantCode)).rejects.toThrowError('Internal server error');
    // });
  });

  describe('getSkillById', () => {
    it('should retrieve skill by ID successfully', async () => {
      const tenantCode = 'testTenant';
      const skillId = '1';

      jest.spyOn(service['tenantRepository'], 'findOne').mockResolvedValueOnce({
        tenant_code: tenantCode,
        tenant_name: 'Test Tenant',
      } as Tenant);

      const mockSkillData = { id: skillId, name: 'Skill 1' };

      (skillsQueriesService.getSkillById as jest.Mock).mockResolvedValueOnce([mockSkillData]);

      const result = await service.getSkillById(skillId, tenantCode);

      expect(result.message).toEqual('skill retrieved successfully.');
      expect(result.data).toEqual(mockSkillData);
    });

    it('should return first skill if multiple skills found for same ID', async () => {
      const tenantCode = 'testTenant';
      const skillId = '1';

      jest.spyOn(service['tenantRepository'], 'findOne').mockResolvedValueOnce({
        tenant_code: tenantCode,
        tenant_name: 'Test Tenant',
      } as Tenant);

      const mockSkillsData = [{ id: skillId, name: 'Skill 1' }, { id: skillId, name: 'Skill 2' }];

      (skillsQueriesService.getSkillById as jest.Mock).mockResolvedValueOnce(mockSkillsData);

      const result = await service.getSkillById(skillId, tenantCode);

      expect(result.message).toEqual('skill retrieved successfully.');
      expect(result.data).toEqual(mockSkillsData[0]); // Assuming returning the first skill in the array
    });

    it('should throw NotFoundException if skill with the given ID is not found', async () => {
      const tenantCode = 'testTenant';
      const skillId = 'nonExistingSkillId';

      jest.spyOn(service['tenantRepository'], 'findOne').mockResolvedValueOnce({
        tenant_code: tenantCode,
        tenant_name: 'Test Tenant',
      } as Tenant);

      (skillsQueriesService.getSkillById as jest.Mock).mockResolvedValueOnce([]);

      await expect(service.getSkillById(skillId, tenantCode)).rejects.toThrowError(NotFoundException);
    });

   
    it('should throw NotFoundException if tenant is not found', async () => {
      const tenantCode = 'nonExistingTenant';
      const skillId = '1';

      jest.spyOn(service['tenantRepository'], 'findOne').mockResolvedValueOnce(undefined);

      await expect(service.getSkillById(skillId, tenantCode)).rejects.toThrowError(NotFoundException);
    });
  });
});
