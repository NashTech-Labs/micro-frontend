import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompetencyService } from './competency.service';
import { CompetencyQueriesService } from './competencyQueries.service';
import { Tenant } from '../tenant/tenant.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CompetencyService', () => {
  let service: CompetencyService;
  let tenantRepository: Repository<Tenant>;
  let competencyQueriesService: CompetencyQueriesService;

  const mockTenantRepository = {
    findOne: jest.fn(),
  };

  const mockCompetencyQueriesService = {
    checkCompetencyName: jest.fn(),
    createCompetency: jest.fn(),
    getAllCompetencies: jest.fn(),
    getCompetencyById: jest.fn(),
    updateCompetency: jest.fn(),
    deleteCompetency: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompetencyService,
        {
          provide: getRepositoryToken(Tenant),
          useValue: mockTenantRepository,
        },
        {
          provide: CompetencyQueriesService,
          useValue: mockCompetencyQueriesService,
        },
      ],
    }).compile();

    service = module.get<CompetencyService>(CompetencyService);
    tenantRepository = module.get<Repository<Tenant>>(
      getRepositoryToken(Tenant),
    );
    competencyQueriesService = module.get<CompetencyQueriesService>(
      CompetencyQueriesService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCompetency', () => {
    it('should throw NotFoundException if tenant is not found', async () => {
      mockTenantRepository.findOne.mockResolvedValue(null);
      await expect(service.createCompetency('tenant1', {})).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if validation fails', async () => {
      mockTenantRepository.findOne.mockResolvedValue({
        tenant_name: 'tenant1',
      });
      const invalidData = { competency_name: '' }; // Invalid data
      await expect(
        service.createCompetency('tenant1', invalidData),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if competency name already exists', async () => {
      mockTenantRepository.findOne.mockResolvedValue({
        tenant_name: 'tenant1',
      });
      mockCompetencyQueriesService.checkCompetencyName.mockResolvedValue([{}]);
      const validData = {
        competency_name: 'New Competency',
        description: 'Description',
      };
      await expect(
        service.createCompetency('tenant1', validData),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create competency and return success message', async () => {
      mockTenantRepository.findOne.mockResolvedValue({
        tenant_name: 'tenant1',
      });
      mockCompetencyQueriesService.checkCompetencyName.mockResolvedValue([]);
      mockCompetencyQueriesService.createCompetency.mockResolvedValue({});
      mockCompetencyQueriesService.checkCompetencyName.mockResolvedValue([{}]);

      const validData = {
        competency_name: 'New Competency',
        description: 'Description',
      };
      const result = await service.createCompetency('tenant1', validData);
      expect(result.message).toEqual(
        'Competency created successfully and data saved.',
      );
    });
  });

  describe('competencyName', () => {
    it('should throw NotFoundException if tenant is not found', async () => {
      mockTenantRepository.findOne.mockResolvedValue(null);
      await expect(service.competencyName('tenant1', {})).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if validation fails', async () => {
      mockTenantRepository.findOne.mockResolvedValue({
        tenant_name: 'tenant1',
      });
      const invalidData = { competency_name: '' }; // Invalid data
      await expect(
        service.competencyName('tenant1', invalidData),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if competency name already exists', async () => {
      mockTenantRepository.findOne.mockResolvedValue({
        tenant_name: 'tenant1',
      });
      mockCompetencyQueriesService.checkCompetencyName.mockResolvedValue([{}]);
      const validData = { competency_name: 'Existing Competency' };
      await expect(
        service.competencyName('tenant1', validData),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return success message if competency name can be created', async () => {
      mockTenantRepository.findOne.mockResolvedValue({
        tenant_name: 'tenant1',
      });
      mockCompetencyQueriesService.checkCompetencyName.mockResolvedValue([]);

      const validData = { competency_name: 'New Competency' };
      const result = await service.competencyName('tenant1', validData);
      expect(result.message).toEqual(
        'Competency with this name can be created',
      );
    });
  });

  describe('getAllCompetencies', () => {
    it('should throw NotFoundException if tenant is not found', async () => {
      mockTenantRepository.findOne.mockResolvedValue(null);
      await expect(service.getAllCompetencies('tenant1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return all competencies for the tenant', async () => {
      mockTenantRepository.findOne.mockResolvedValue({
        tenant_name: 'tenant1',
      });
      mockCompetencyQueriesService.getAllCompetencies.mockResolvedValue([{}]);

      const result = await service.getAllCompetencies('tenant1');
      expect(result.message).toEqual(
        'Retrieved all competencies successfully.',
      );
      expect(result.data).toEqual([{}]);
    });
  });

  describe('getCompetencyById', () => {
    it('should throw NotFoundException if tenant is not found', async () => {
      mockTenantRepository.findOne.mockResolvedValue(null);
      await expect(service.getCompetencyById('1', 'tenant1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if validation fails', async () => {
      mockTenantRepository.findOne.mockResolvedValue({
        tenant_name: 'tenant1',
      });
      await expect(service.getCompetencyById('', 'tenant1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return competency if found', async () => {
      mockTenantRepository.findOne.mockResolvedValue({
        tenant_name: 'tenant1',
      });
      mockCompetencyQueriesService.getCompetencyById.mockResolvedValue([{}]);

      const result = await service.getCompetencyById('1', 'tenant1');
      expect(result.message).toEqual('Competency retrieved successfully.');
      expect(result.data).toEqual({});
    });

    it('should return message if competency is not found', async () => {
      mockTenantRepository.findOne.mockResolvedValue({
        tenant_name: 'tenant1',
      });
      mockCompetencyQueriesService.getCompetencyById.mockResolvedValue([]);

      const result = await service.getCompetencyById('1', 'tenant1');
      expect(result.message).toEqual('Competency not found.');
      expect(result.data).toBeNull();
    });
  });

  describe('updateCompetency', () => {
    it('should throw NotFoundException if tenant is not found', async () => {
      mockTenantRepository.findOne.mockResolvedValue(null);
      await expect(
        service.updateCompetency('1', 'tenant1', {}),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if validation fails', async () => {
      mockTenantRepository.findOne.mockResolvedValue({
        tenant_name: 'tenant1',
      });
      const invalidData = { competency_name: '' }; // Invalid data
      await expect(
        service.updateCompetency('1', 'tenant1', invalidData),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if competency is not found', async () => {
      mockTenantRepository.findOne.mockResolvedValue({
        tenant_name: 'tenant1',
      });
      mockCompetencyQueriesService.getCompetencyById.mockResolvedValue([]);
      const validData = {
        competency_name: 'Updated Competency',
        description: 'Description',
      };
      await expect(
        service.updateCompetency('1', 'tenant1', validData),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update competency and return success message', async () => {
      mockTenantRepository.findOne.mockResolvedValue({
        tenant_name: 'tenant1',
      });
      mockCompetencyQueriesService.getCompetencyById.mockResolvedValue([{}]);
      mockCompetencyQueriesService.updateCompetency.mockResolvedValue({});
      mockCompetencyQueriesService.getCompetencyById.mockResolvedValue([{}]);

      const validData = {
        competency_name: 'Updated Competency',
        description: 'Description',
      };
      const result = await service.updateCompetency('1', 'tenant1', validData);
      expect(result.message).toEqual('Competency updated successfully.');
      expect(result.data).toEqual({});
    });
  });

  describe('deleteCompetency', () => {
    it('should throw NotFoundException if tenant is not found', async () => {
      mockTenantRepository.findOne.mockResolvedValue(null);
      await expect(service.deleteCompetency('1', 'tenant1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if validation fails', async () => {
      mockTenantRepository.findOne.mockResolvedValue({
        tenant_name: 'tenant1',
      });
      await expect(service.deleteCompetency('', 'tenant1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if competency is not found', async () => {
      mockTenantRepository.findOne.mockResolvedValue({
        tenant_name: 'tenant1',
      });
      mockCompetencyQueriesService.getCompetencyById.mockResolvedValue([]);
      await expect(service.deleteCompetency('1', 'tenant1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should delete competency and return success message', async () => {
      mockTenantRepository.findOne.mockResolvedValue({
        tenant_name: 'tenant1',
      });
      mockCompetencyQueriesService.getCompetencyById.mockResolvedValue([{}]);
      mockCompetencyQueriesService.deleteCompetency.mockResolvedValue({});

      const result = await service.deleteCompetency('1', 'tenant1');
      expect(result.message).toEqual('Competency deleted successfully.');
    });
  });
});
