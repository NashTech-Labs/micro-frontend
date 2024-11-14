import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { Tenant } from './tenant.entity';

describe('TenantController', () => {
  let controller: TenantController;
  let service: TenantService;
  let repository: Repository<Tenant>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantController],
      providers: [
        TenantService,
        {
          provide: getRepositoryToken(Tenant),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<TenantController>(TenantController);
    service = module.get<TenantService>(TenantService);
    repository = module.get<Repository<Tenant>>(getRepositoryToken(Tenant));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new tenant', async () => {
      const tenantData: Tenant = {
        id: 1,
        tenant_name: 'nashtech',
        tenant_email: 'test@nashtech.comzzz',
        role: 'admin',
        tenant_code: 'TNT5xx1',
        password: 'password123',
        status: 'active',
        phone: '938476737283',
        location: 'india',
        subscription_details: ['gold'],
        company_type: 'x.xx;',
        image: 'asdmsfcms',
        created_at: undefined,
        updated_at: undefined,
      };
      const expectedResult = {
        message: 'Tenant created successfully',
        data: tenantData,
      };
      jest.spyOn(service, 'createTenant').mockResolvedValueOnce(expectedResult);

      expect(await controller.create(tenantData)).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update an existing tenant', async () => {
      const tenantData: Tenant = {
        id: 1,
        tenant_name: 'nashtech',
        tenant_email: 'test@nashtech.comzzz',
        role: 'admin',
        tenant_code: 'TNT5xx1',
        password: 'password123',
        status: 'active',
        phone: '11111111111111',
        location: 'india',
        subscription_details: ['gold'],
        company_type: 'x.xx;',
        image: 'asdmsfcms',
        created_at: undefined,
        updated_at: undefined,
      };
      const updatedTenant: Tenant = {
        ...tenantData,
      };
      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(updatedTenant);

      const expectedResult = {
        message: 'Tenant updated successfully',
        updatedData: updatedTenant,
      };
      expect(await controller.update(1, tenantData)).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should delete a tenant by ID', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValueOnce(undefined);
      const id = 1; // Assuming ID 1 exists for a tenant to be deleted
      expect(await controller.remove(id)).toEqual(
        `Tenant with ID ${id} deleted successfully`,
      );
    });
  });
});
