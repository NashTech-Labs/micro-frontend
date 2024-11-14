import { Test, TestingModule } from '@nestjs/testing';
import { CompetencyController } from './competency.controller';
import { CompetencyService } from './competency.service';

describe('CompetencyController', () => {
  let controller: CompetencyController;
  let service: CompetencyService;

  const mockCompetencyService = {
    createCompetency: jest.fn((tenantName, userData) =>
      Promise.resolve({ id: '1', ...userData }),
    ),
    competencyName: jest.fn((tenantName, data) =>
      Promise.resolve({ name: data.name }),
    ),
    getAllCompetencies: jest.fn((tenantName) =>
      Promise.resolve([{ id: '1', name: 'Competency 1' }]),
    ),
    getCompetencyById: jest.fn((id, tenantName) =>
      Promise.resolve({ id, name: 'Competency 1' }),
    ),
    updateCompetency: jest.fn((id, tenantName, compentencyData) =>
      Promise.resolve({ id, ...compentencyData }),
    ),
    deleteCompetency: jest.fn((id, tenantName) =>
      Promise.resolve({ deleted: true }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompetencyController],
      providers: [
        {
          provide: CompetencyService,
          useValue: mockCompetencyService,
        },
      ],
    }).compile();

    controller = module.get<CompetencyController>(CompetencyController);
    service = module.get<CompetencyService>(CompetencyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a competency', async () => {
    const tenantName = 'tenant1';
    const userData = { name: 'New Competency' };
    const req = { headers: { tenant_code: tenantName } };
    expect(await controller.createCompetency(userData, req)).toEqual({
      id: '1',
      ...userData,
    });
    expect(service.createCompetency).toHaveBeenCalledWith(tenantName, userData);
  });

  it('should return competency name', async () => {
    const tenantName = 'tenant1';
    const data = { name: 'Competency Name' };
    const req = { headers: { tenant_code: tenantName } };
    expect(await controller.competencyName(data, req)).toEqual({
      name: data.name,
    });
    expect(service.competencyName).toHaveBeenCalledWith(tenantName, data);
  });

  it('should get all competencies', async () => {
    const tenantName = 'tenant1';
    const req = { headers: { tenant_code: tenantName } };
    expect(await controller.getAllCompetencies(req)).toEqual([
      { id: '1', name: 'Competency 1' },
    ]);
    expect(service.getAllCompetencies).toHaveBeenCalledWith(tenantName);
  });

  it('should get a competency by id', async () => {
    const tenantName = 'tenant1';
    const id = '1';
    const req = { headers: { tenant_code: tenantName } };
    expect(await controller.getCompetencyById(id, req)).toEqual({
      id,
      name: 'Competency 1',
    });
    expect(service.getCompetencyById).toHaveBeenCalledWith(id, tenantName);
  });

  it('should update a competency', async () => {
    const tenantName = 'tenant1';
    const id = '1';
    const compentencyData = { name: 'Updated Competency' };
    const req = { headers: { tenant_code: tenantName } };
    expect(await controller.updateCompetency(id, compentencyData, req)).toEqual(
      { id, ...compentencyData },
    );
    expect(service.updateCompetency).toHaveBeenCalledWith(
      id,
      tenantName,
      compentencyData,
    );
  });

  it('should delete a competency', async () => {
    const tenantName = 'tenant1';
    const id = '1';
    const req = { headers: { tenant_code: tenantName } };
    expect(await controller.deleteCompetency(id, req)).toEqual({
      deleted: true,
    });
    expect(service.deleteCompetency).toHaveBeenCalledWith(id, tenantName);
  });
});
