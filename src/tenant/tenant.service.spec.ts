import { Test, TestingModule } from '@nestjs/testing';
import { TenantService } from './tenant.service';
import { Tenant } from './tenant.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TenantService', () => {
  let service: TenantService;

  const mockTenantRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    manager: {
      connection: {
        createQueryRunner: jest.fn().mockReturnValue({
          connect: jest.fn(),
          startTransaction: jest.fn(),
          query: jest.fn(),
          commitTransaction: jest.fn(),
          rollbackTransaction: jest.fn(),
          release: jest.fn(),
        }),
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantService,
        {
          provide: getRepositoryToken(Tenant),
          useValue: mockTenantRepository,
        },
      ],
    }).compile();

    service = module.get<TenantService>(TenantService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a message when tenant name already exists', async () => {
    const tenantData = {
      tenant_name: 'TestName',
      tenant_email: 'test@example.com',
      role: 'admin',
      tenant_code: 'code123',
      password: 'pass123',
      status: 'active',
    };
    mockTenantRepository.findOne.mockResolvedValueOnce({
      tenant_name: 'TestName',
    });

    const result = await service.createTenant(tenantData);

    expect(result).toEqual({
      message: "Tenant with name 'TestName' already exists.",
      data: undefined,
    });
    expect(mockTenantRepository.findOne).toHaveBeenCalledWith({
      where: { tenant_name: 'TestName' },
    });
  });

  it('should return a message when tenant email already exists', async () => {
    const tenantData = {
      tenant_name: 'TestName',
      tenant_email: 'test@example.com',
      role: 'admin',
      tenant_code: 'code123',
      password: 'pass123',
      status: 'active',
    };
    mockTenantRepository.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ tenant_email: 'test@example.com' });

    const result = await service.createTenant(tenantData);

    expect(result).toEqual({
      message: "Tenant with email 'test@example.com' already exists.",
      data: undefined,
    });
    expect(mockTenantRepository.findOne).toHaveBeenCalledWith({
      where: { tenant_name: 'TestName' },
    });
    expect(mockTenantRepository.findOne).toHaveBeenCalledWith({
      where: { tenant_email: 'test@example.com' },
    });
  });

  it('should return a message when tenant code already exists', async () => {
    const tenantData = {
      tenant_name: 'TestName',
      tenant_email: 'test@example.com',
      role: 'admin',
      tenant_code: 'code123',
      password: 'pass123',
      status: 'active',
    };
    mockTenantRepository.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ tenant_code: 'code123' });

    const result = await service.createTenant(tenantData);

    expect(result).toEqual({
      message: "Tenant with code 'code123' already exists.",
      data: undefined,
    });
    expect(mockTenantRepository.findOne).toHaveBeenCalledWith({
      where: { tenant_name: 'TestName' },
    });
    expect(mockTenantRepository.findOne).toHaveBeenCalledWith({
      where: { tenant_email: 'test@example.com' },
    });
    expect(mockTenantRepository.findOne).toHaveBeenCalledWith({
      where: { tenant_code: 'code123' },
    });
  });

  it('should create a new tenant successfully', async () => {
    const tenantData = {
      tenant_name: 'TestName',
      tenant_email: 'test@example.com',
      role: 'admin',
      tenant_code: 'code123',
      password: 'pass123',
      status: 'active',
    };
    mockTenantRepository.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    mockTenantRepository.save.mockResolvedValue({
      ...tenantData,
      tenant_name: tenantData.tenant_name.toLowerCase(),
    });

    // Spying on the private methods
    jest.spyOn<any, any>(service, 'createSchemaIfNotExists');
    jest.spyOn<any, any>(service, 'createUserTable');

    const result = await service.createTenant(tenantData);

    expect(result.message).toBe('Tenant created successfully.');
    expect(result.data).toBeDefined();
    expect(result.data?.tenant_name).toBe(tenantData.tenant_name.toLowerCase());
    expect(mockTenantRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ tenant_name: 'testname' }),
    );
  });
});
