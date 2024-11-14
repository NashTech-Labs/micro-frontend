import { Test, TestingModule } from '@nestjs/testing';
import { SkillController } from './skills.controller';
import { SkillService } from './skills.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateSkillDto, SkillNameDto, SkillIdDto } from './skills.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

describe('SkillController', () => {
  let controller: SkillController;
  let service: SkillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkillController],
      providers: [
        {
          provide: SkillService,
          useValue: {
            createSkill: jest.fn(),
            skillName: jest.fn(),
            getAllSkills: jest.fn(),
            getSkillById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SkillController>(SkillController);
    service = module.get<SkillService>(SkillService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createSkill', () => {
    it('should create a new skill', async () => {
      const mockUserData: CreateSkillDto = { skill_name: 'New Skill' };
      const mockRequest = { headers: { tenant_code: 'testTenant' } };

      jest.spyOn(service, 'createSkill').mockResolvedValueOnce({ message: 'Skill created successfully' });

      const result = await controller.createSkill(mockRequest, mockUserData);

      expect(result).toEqual({ message: 'Skill created successfully' });
      expect(service.createSkill).toHaveBeenCalledWith('testTenant', mockUserData);
    });

    it('should throw BadRequestException if DTO validation fails', async () => {
      const mockUserData: CreateSkillDto = { skill_name: '' }; // Invalid DTO
      const mockRequest = { headers: { tenant_code: 'testTenant' } };

      await expect(controller.createSkill(mockRequest, mockUserData)).rejects.toThrowError(BadRequestException);
    });
  });

  describe('skillName', () => {
    it('should check if skill name can be created', async () => {
      const mockData: SkillNameDto = { skill_name: 'New Skill' };
      const mockRequest = { headers: { tenant_code: 'testTenant' } };

      jest.spyOn(service, 'skillName').mockResolvedValueOnce({ message: 'Skill name can be created' });

      const result = await controller.skillName(mockRequest, mockData);

      expect(result).toEqual({ message: 'Skill name can be created' });
      expect(service.skillName).toHaveBeenCalledWith('testTenant', mockData);
    });

    it('should throw BadRequestException if DTO validation fails', async () => {
      const mockData: SkillNameDto = { skill_name: '' }; // Invalid DTO
      const mockRequest = { headers: { tenant_code: 'testTenant' } };

      await expect(controller.skillName(mockRequest, mockData)).rejects.toThrowError(BadRequestException);
    });
  });

  describe('getAllSkills', () => {
    it('should retrieve all skills', async () => {
      const mockRequest = { headers: { tenant_code: 'testTenant' } };
      const mockSkills = [{ id: '1', name: 'Skill 1' }, { id: '2', name: 'Skill 2' }];

      jest.spyOn(service, 'getAllSkills').mockResolvedValueOnce({ message: 'Retrieved all skills', data: mockSkills });

      const result = await controller.getAllSkills(mockRequest);

      expect(result).toEqual({ message: 'Retrieved all skills', data: mockSkills });
      expect(service.getAllSkills).toHaveBeenCalledWith('testTenant');
    });
  });

  describe('getSkillById', () => {
    it('should retrieve skill by ID', async () => {
      const mockRequest = { headers: { tenant_code: 'testTenant' } };
      const mockSkillId = '1';
      const mockSkill = { id: '1', name: 'Skill 1' };

      jest.spyOn(service, 'getSkillById').mockResolvedValueOnce({ message: 'Skill retrieved', data: mockSkill });

      const result = await controller.getSkillById(mockSkillId, mockRequest);

      expect(result).toEqual({ message: 'Skill retrieved', data: mockSkill });
      expect(service.getSkillById).toHaveBeenCalledWith(mockSkillId, 'testTenant');
    });

   
  });
});
