import { Test, TestingModule } from '@nestjs/testing';
import { employeeSkillController } from './employeeSkill.controller';
import { employeeSkillService } from './employeeSkill.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateEmployeeSkillDto, EmployeeSkillNameDto, EmployeeSkillIdDto, DeleteEmployeeSkillDto } from './employeeSKill.dto';

describe('employeeSkillController', () => {
  let controller: employeeSkillController;
  let service: employeeSkillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [employeeSkillController],
      providers: [{
        provide: employeeSkillService,
        useValue: {
          createEmployeeSkill: jest.fn(),
          GetEmployeeSkillByName: jest.fn(),
          getEmployeeSkillByEmployeeId: jest.fn(),
          deleteEmployeeSkill: jest.fn(),
        }
      }],
    }).compile();

    controller = module.get<employeeSkillController>(employeeSkillController);
    service = module.get<employeeSkillService>(employeeSkillService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createEmployeeSkill', () => {
    it('should create employee skill successfully', async () => {
      const tenantCode = 'TestTenant';
      const userData: CreateEmployeeSkillDto = {
          skill_name: 'NewSkill',
          employee_id: 0,
          studio: 0,
          level: 0
      };

      jest.spyOn(service, 'createEmployeeSkill').mockResolvedValue({ message: 'employeeSkill created successfully and data saved.' });

      const result = await controller.createEmployeeSkill({ headers: { tenant_code: tenantCode } }, userData);

      expect(result).toEqual({ message: 'employeeSkill created successfully and data saved.' });
      expect(service.createEmployeeSkill).toHaveBeenCalledWith(tenantCode, userData);
    });

    it('should handle validation errors', async () => {
      const tenantCode = 'TestTenant';
      const userData: CreateEmployeeSkillDto = {
          skill_name: '',
          employee_id: 0,
          studio: 0,
          level: 0
      };

      const expectedError = new BadRequestException('skill_name should not be empty');

      jest.spyOn(service, 'createEmployeeSkill').mockRejectedValue(expectedError);

      await expect(controller.createEmployeeSkill({ headers: { tenant_code: tenantCode } }, userData))
        .rejects.toThrowError(expectedError);
    });

    
  });

  describe('employeeSkillName', () => {
    it('should get employee skill by name successfully', async () => {
      const tenantCode = 'TestTenant';
      const data: EmployeeSkillNameDto = {
        skill_name: 'NewSkill',
        // add other fields as needed by the DTO
      };

      jest.spyOn(service, 'GetEmployeeSkillByName').mockResolvedValue({ message: 'employeeSkill with this name can be created' });

      const result = await controller.employeeSkillName({ headers: { tenant_code: tenantCode } }, data);

      expect(service.GetEmployeeSkillByName).toHaveBeenCalledWith(tenantCode, data);
    });

    it('should handle validation errors', async () => {
      const tenantCode = 'TestTenant';
      const data: EmployeeSkillNameDto = {
        skill_name: '', // invalid data
      };

      const expectedError = new BadRequestException('skill_name should not be empty');

      jest.spyOn(service, 'GetEmployeeSkillByName').mockRejectedValue(expectedError);

      await expect(controller.employeeSkillName({ headers: { tenant_code: tenantCode } }, data))
        .rejects.toThrowError(expectedError);
    });

    
  });

  describe('getEmployeeSkillByEmployeeId', () => {
    it('should get employee skill by employee ID successfully', async () => {
      const tenantCode = 'TestTenant';
      const employee_id = '123';

      jest.spyOn(service, 'getEmployeeSkillByEmployeeId').mockResolvedValue({ message: 'employeeSkill retrieved successfully.', data : {} });

      const result = await controller.getEmployeeSkillByEmployeeId(employee_id, { headers: { tenant_code: tenantCode } });

      expect(result).toEqual({ message: 'employeeSkill retrieved successfully.' });
      expect(service.getEmployeeSkillByEmployeeId).toHaveBeenCalledWith(employee_id, tenantCode);
    });

    it('should handle validation errors', async () => {
      const tenantCode = 'TestTenant';
      const employee_id = ''; // invalid employee_id

      const expectedError = new BadRequestException('employee_id should not be empty');

      jest.spyOn(service, 'getEmployeeSkillByEmployeeId').mockRejectedValue(expectedError);

      await expect(controller.getEmployeeSkillByEmployeeId(employee_id, { headers: { tenant_code: tenantCode } }))
        .rejects.toThrowError(expectedError);
    });

    
  });

  describe('deleteEmployeeSkill', () => {
    it('should delete employee skill successfully', async () => {
      const tenantCode = 'TestTenant';
      const id = '1';
      const level = '1';

      jest.spyOn(service, 'deleteEmployeeSkill').mockResolvedValue({ message: 'employeeSkill deleted successfully.' });

      const result = await controller.deleteEmployeeSkill(id, level, { headers: { tenant_code: tenantCode } });

      expect(result).toEqual({ message: 'employeeSkill deleted successfully.' });
      expect(service.deleteEmployeeSkill).toHaveBeenCalledWith(id, level, tenantCode);
    });

    it('should handle validation errors', async () => {
      const tenantCode = 'TestTenant';
      const id = ''; // invalid id
      const level = '1';

      const expectedError = new BadRequestException('id should not be empty');

      jest.spyOn(service, 'deleteEmployeeSkill').mockRejectedValue(expectedError);

      await expect(controller.deleteEmployeeSkill(id, level, { headers: { tenant_code: tenantCode } }))
        .rejects.toThrowError(expectedError);
    });

   
  });
});
