import { Test, TestingModule } from '@nestjs/testing';
import { PracticeController } from './practice.controller';
import { PracticeService } from './practice.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tenant } from '../tenant/tenant.entity';
import { Repository } from 'typeorm';

describe('practiceController', () => {
  let controller: PracticeController;
  let service: PracticeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PracticeController],
      providers: [
        PracticeService,
        {
          provide: getRepositoryToken(Tenant), // Use getRepositoryToken to provide the repository token
          useClass: Repository, // Mock Repository class
        },
      ],
    }).compile();

    controller = module.get<PracticeController>(PracticeController);
    service = module.get<PracticeService>(PracticeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // describe('createpractice', () => {
  //   it('should create a new practice', async () => {
  //     const userData = {
  //       "title": "Practice TitleRssssqsooo",
  // "description": "Practice Description",
  // "total_employee": "10",
  // "studio_head":"NewHead",
  // "location":"India"
  //     };
  //     const tenantName = 'example';

  //     jest.spyOn(service, 'createPractice').mockResolvedValue({ message: 'practice created successfully' });

  //     const result = await controller.createPractice( { headers: { tenant_name: tenantName }}, userData);
  //     expect(result).toEqual({ message: 'practice created successfully' });
  //   });
  // });
  describe('getAllPractices', () => {
    it('should retrieve all competencies', async () => {
      const tenantName = 'example';

      jest.spyOn(service, 'getAllPractices').mockResolvedValue({
        message: 'Retrieved all practices successfully',
        data: [],
      });

      const result = await controller.getAllPractices({
        headers: { tenant_name: tenantName },
      });
      expect(result).toEqual({
        message: 'Retrieved all practices successfully',
        data: [],
      });
    });
  });

  // describe('getpracticeById', () => {
  //   it('should retrieve a practice by ID', async () => {
  //     const practiceId = '1';
  //     const tenantName = 'example';

  //     jest.spyOn(service, 'getPracticeById').mockResolvedValue({ message: 'practice retrieved successfully', data: { id: 1, practice_name: 'practice A' } });

  //     const result = await controller.getPracticeById(practiceId, { headers: { tenant_name: tenantName } });
  //     expect(result).toEqual({ message: 'practice retrieved successfully', data: { id: 1, practice_name: 'practice A' } });
  //   });
  // });

  // describe('updatepractice', () => {
  //   it('should update a practice', async () => {
  //     const practiceId = '1';
  //     const tenantName = 'example';
  //     const compentencyData = {
  //       practice_name: 'Updated practice',
  //       practice_admin_email: 'updated_admin@example.com',
  //       status: 'inactive',
  //     };

  //     jest.spyOn(service, 'updatePractice').mockResolvedValue({ message: 'practice updated successfully', data: { id: 1, practice_name: 'Updated practice' } });

  //     const result = await controller.updatePractice(practiceId, compentencyData, { headers: { tenant_name: tenantName } });
  //     expect(result).toEqual({ message: 'practice updated successfully', data: { id: 1, practice_name: 'Updated practice' } });
  //   });
  // });
});
