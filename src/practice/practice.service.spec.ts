import { Test, TestingModule } from '@nestjs/testing';
import { PracticeService } from './practice.service';
import { Repository } from 'typeorm';

import { getRepositoryToken } from '@nestjs/typeorm';
import { Tenant } from '../tenant/tenant.entity';

describe('PracticeService', () => {
  let service: PracticeService;
  let tenantRepository: Repository<Tenant>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PracticeService,
        {
          provide: getRepositoryToken(Tenant),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PracticeService>(PracticeService);
    tenantRepository = module.get<Repository<Tenant>>(
      getRepositoryToken(Tenant),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPractice', () => {
    it('should create a practice successfully', async () => {
      const tenantName = 'example';
      const userData = {
        title: 'New Practice',
        description: 'Description of the new practice',
        total_employee: 10,
        studio_head: 'John Doe',
        location: 'City, Country',
      };

      jest
        .spyOn(tenantRepository, 'findOne')
        .mockResolvedValueOnce({ tenant_name: tenantName } as any);
      jest.spyOn(tenantRepository, 'query').mockResolvedValue([]);

      const result = await service.createPractice(tenantName, userData);
      expect(result.message).toBe(
        'Practice created successfully and data saved.',
      );
      expect(result.data).toBeDefined();
    });

    it('should throw an error if tenant does not exist', async () => {
      jest.spyOn(tenantRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(
        service.createPractice('non_existing_tenant', {}),
      ).rejects.toThrow('Tenant not found');
    });

    it('should throw an error if practice with the same name already exists', async () => {
      const tenantName = 'example';
      const mockTenant = new Tenant();
      mockTenant.tenant_name = tenantName;
      jest.spyOn(tenantRepository, 'findOne').mockResolvedValue(mockTenant);
      jest
        .spyOn(tenantRepository, 'query')
        .mockResolvedValue([{ id: 1, title: 'New Practice' }]);
      const result = await service.createPractice('example', {
        title: 'New Practice',
      });
      expect(result.message).toEqual(
        'Practice with this name already exists. Please use another name.',
      );
    });
  });

  describe('getAllPractices', () => {
    it('should retrieve all practices successfully', async () => {
      const tenantName = 'example';

      jest.spyOn(tenantRepository, 'query').mockResolvedValueOnce([]);

      const result = await service.getAllPractices(tenantName);
      expect(result.message).toBe('Retrieved all Practice successfully.');
      expect(result.data).toBeDefined();
    });
  });

  describe('getPracticeById', () => {
    it('should retrieve a practice by ID successfully', async () => {
      const tenantName = 'example';
      const practiceId = '1';

      jest
        .spyOn(tenantRepository, 'query')
        .mockResolvedValueOnce([{ id: 1, title: 'Test Practice' }] as any);

      const result = await service.getPracticeById(practiceId, tenantName);
      expect(result.message).toBe('Practice retrieved successfully.');
      expect(result.data).toBeDefined();
    });
  });

  describe('updatePractice', () => {
    it('should update a practice successfully', async () => {
      const tenantName = 'example';
      const practiceId = '1';
      const userData = {
        title: 'Updated Practice',
        description: 'Updated description',
        total_employee: 15,
        studio_head: 'Jane Doe',
        image: 'updated_image_url',
      };

      jest
        .spyOn(tenantRepository, 'findOne')
        .mockResolvedValueOnce({ tenant_name: tenantName } as any);
      jest.spyOn(tenantRepository, 'query').mockResolvedValueOnce([]);
      jest
        .spyOn(tenantRepository, 'query')
        .mockResolvedValueOnce([{ id: 1, title: 'Updated Practice' }] as any);

      const result = await service.updatePractice(
        practiceId,
        tenantName,
        userData,
      );
      expect(result.message).toBe('Practice data updated successfully.');
      expect(result.data).toBeDefined();
    });

    it('should throw an error if tenant does not exist', async () => {
      // Mocking the findOne method of the tenantRepository to return null indicating tenant not found
      jest.spyOn(tenantRepository, 'findOne').mockResolvedValueOnce(null);

      // Calling the deletePractice method and expecting it to throw an error
      await expect(
        service.updatePractice('1', 'non_existing_tenant', {}),
      ).rejects.toThrow('Tenant not found');
    });
  });

  describe('deletePractice', () => {
    it('should delete a practice successfully', async () => {
      const tenantName = 'example';
      const practiceId = '1';

      const mockTenant = new Tenant();
      mockTenant.tenant_name = tenantName;

      jest.spyOn(tenantRepository, 'findOne').mockResolvedValueOnce(mockTenant);
      jest.spyOn(tenantRepository, 'query').mockResolvedValueOnce([]);

      const result = await service.deletePractice(practiceId, tenantName);
      expect(result.message).toBe('Practice deleted successfully.');
    });

    it('should throw an error if tenant does not exist', async () => {
      // Mocking the findOne method of the tenantRepository to return null indicating tenant not found
      jest.spyOn(tenantRepository, 'findOne').mockResolvedValueOnce(null);

      // Calling the deletePractice method and expecting it to throw an error
      await expect(
        service.deletePractice('1', 'non_existing_tenant'),
      ).rejects.toThrow('Tenant not found');
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
