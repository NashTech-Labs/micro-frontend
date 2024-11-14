import { Test, TestingModule } from '@nestjs/testing';
import { LoginService } from './login.service';
import { BadRequestException } from '@nestjs/common';

describe('LoginService', () => {
  let service: LoginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginService],
    }).compile();

    service = module.get<LoginService>(LoginService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('loginService', () => {
    it('should throw BadRequestException if email or password is invalid', async () => {
      const invalidBody = { email: 'invalid-email', password: '123456' };
      await expect(service.loginService(invalidBody)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if tenant not found for non-admin email', async () => {
      const nonAdminBody = {
        email: 'nonadmin@example.com',
        password: 'password',
      };
      await expect(service.loginService(nonAdminBody)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if email not found for existing tenant', async () => {
      const emailNotFoundBody = {
        email: 'notfound@example.com',
        password: 'password',
      };
      await expect(service.loginService(emailNotFoundBody)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if admin not found for admin email', async () => {
      const adminNotFoundBody = {
        email: 'admin@nashtech.com',
        password: 'password',
      };
      await expect(service.loginService(adminNotFoundBody)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('tenantLogin', () => {
    it('should throw BadRequestException if email or password is invalid', async () => {
      const invalidBody = { email: 'invalid-email', password: '123456' };
      await expect(service.tenantLogin(invalidBody)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if tenant not found', async () => {
      const notFoundBody = {
        email: 'notfound@example.com',
        password: 'password',
      };
      await expect(service.tenantLogin(notFoundBody)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if email not found for existing tenant', async () => {
      const emailNotFoundBody = {
        email: 'notfound@example.com',
        password: 'password',
      };
      await expect(service.tenantLogin(emailNotFoundBody)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return user with token if credentials are correct', async () => {
      // Assuming 'password' is the correct password for the tenant
      const correctCredentialsBody = {
        email: 'tenant@example.com',
        password: 'password',
      };
      const result = await service.tenantLogin(correctCredentialsBody);
      expect(result).toHaveProperty('message', 'Login successful');
      expect(result).toHaveProperty('user');
      expect(result.user).toHaveProperty('email', correctCredentialsBody.email);
      expect(result.user).toHaveProperty('token');
    });
  });

  describe('employeeLogin', () => {
    it('should throw BadRequestException if email or password is invalid', async () => {
      const invalidBody = {
        email: 'invalid-email',
        password: '123456',
        domain: 'example',
      };

      await expect(service.employeeLogin(invalidBody)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if employee not found', async () => {
      const notFoundBody = {
        email: 'notfound@example.com',
        password: 'password',
        domain: 'example',
      };
      await expect(service.employeeLogin(notFoundBody)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if password is incorrect', async () => {
      // Assuming 'correctpassword' is the correct password for the employee
      const incorrectPasswordBody = {
        email: 'employee@example.com',
        password: 'incorrectpassword',
        domain: 'example',
      };
      await expect(
        service.employeeLogin(incorrectPasswordBody),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('adminLogin', () => {
    it('should throw BadRequestException if email or password is invalid', async () => {
      const invalidBody = {
        email: 'invalid-email',
        password: '123456',
        domain: 'example',
      };

      await expect(service.adminLogin(invalidBody)).rejects.toThrow(
        BadRequestException,
      );
    });

    // Add more test cases for adminLogin method here
    it('should throw BadRequestException if admin not found', async () => {
      const notFoundBody = {
        email: 'notfound@example.com',
        password: 'password',
        domain: 'example',
      };

      await expect(service.adminLogin(notFoundBody)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if password is incorrect', async () => {
      const invalidPasswordBody = {
        email: 'admin@example.com',
        password: 'incorrect',
        domain: 'example',
      };

      await expect(service.adminLogin(invalidPasswordBody)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
