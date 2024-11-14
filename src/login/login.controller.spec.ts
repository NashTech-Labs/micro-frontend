import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { BadRequestException } from '@nestjs/common';

describe('LoginController', () => {
  let controller: LoginController;
  let service: LoginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [LoginService],
    }).compile();

    controller = module.get<LoginController>(LoginController);
    service = module.get<LoginService>(LoginService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return user data on successful login', async () => {
      const loginData = { email: 'test@example.com', password: 'password' };
      const userData = {
        id: 1,
        name: 'John Doe',
        email: 'test@example.com',
        token: 'jwt_token',
      };

      jest.spyOn(service, 'loginService').mockResolvedValue(userData);

      const result = await controller.login(loginData);
      expect(result).toEqual(userData);
    });

    it('should throw BadRequestException for invalid email or password', async () => {
      const invalidLoginData = { email: 'invalid-email', password: '123456' };

      jest.spyOn(service, 'loginService').mockImplementation(() => {
        throw new BadRequestException('Invalid email or password');
      });

      await expect(controller.login(invalidLoginData)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
