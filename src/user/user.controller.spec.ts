import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tenant } from '../tenant/tenant.entity';
import { Repository } from 'typeorm';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(Tenant), // Use getRepositoryToken to provide the repository token
          useClass: Repository, // Mock Repository class
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };
      const tenantName = 'example';

      jest
        .spyOn(service, 'createUser')
        .mockResolvedValue({ message: 'User created successfully' });

      const result = await controller.createUser(
        { headers: { tenant_name: tenantName } },
        userData,
      );
      expect(result).toEqual({ message: 'User created successfully' });
    });
  });

  describe('filterUsersByLocation', () => {
    it('should filter users by location', async () => {
      const location = 'New York';
      const tenantName = 'example';

      jest.spyOn(service, 'filterUsersByLocation').mockResolvedValue({
        message: 'Users filtered successfully',
        data: [],
      });

      const result = await controller.filterUsersByLocation(location, {
        headers: { tenant_name: tenantName },
      });
      expect(result).toEqual({
        message: 'Users filtered successfully',
        data: [],
      });
    });
  });

  describe('getAllUsers', () => {
    it('should retrieve all users', async () => {
      const tenantName = 'example';

      jest.spyOn(service, 'getAllUsers').mockResolvedValue({
        message: 'Retrieved all users successfully',
        data: [],
      });

      const result = await controller.getAllUsers({
        headers: { tenant_name: tenantName },
      });
      expect(result).toEqual({
        message: 'Retrieved all users successfully',
        data: [],
      });
    });
  });

  // describe('getUserById', () => {
  //   it('should retrieve a user by ID', async () => {
  //     const userId = '1';
  //     const tenantName = 'example';

  //     jest.spyOn(service, 'getUserById').mockResolvedValue({ message: 'User retrieved successfully', data: { id: 1, firstName: 'John' } });

  //     const result = await controller.getUserById(userId, { headers: { tenant_name: tenantName } });
  //     expect(result).toEqual({ message: 'User retrieved successfully', data: { id: 1, firstName: 'John' } });
  //   });
  // });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const userId = '1';
      const tenantName = 'example';
      const userData = {
        firstName: 'Updated',
        lastName: 'User',
        email: 'updated@example.com',
      };

      jest.spyOn(service, 'updateUser').mockResolvedValue({
        message: 'User updated successfully',
        data: { id: 1, firstName: 'Updated' },
      });

      const result = await controller.updateUser(userId, userData, {
        headers: { tenant_name: tenantName },
      });
      expect(result).toEqual({
        message: 'User updated successfully',
        data: { id: 1, firstName: 'Updated' },
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const userId = '1';
      const tenantName = 'example';

      jest
        .spyOn(service, 'deleteUser')
        .mockResolvedValue({ message: 'User deleted successfully' });

      const result = await controller.deleteUser(userId, {
        headers: { tenant_name: tenantName },
      });
      expect(result).toEqual({ message: 'User deleted successfully' });
    });
  });
});
