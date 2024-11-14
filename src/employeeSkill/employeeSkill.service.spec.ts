// import { Test, TestingModule } from '@nestjs/testing';
// import { BadRequestException, NotFoundException } from '@nestjs/common';
// import { Repository } from 'typeorm';
// import { employeeSkillService } from './employeeSkill.service';
// import { employeeSkillQueriesService } from './employeeSkillQueries.service';
// import { SkillsQueriesService } from './../Skills/skillsQueries.service';
// import { Tenant } from '../tenant/tenant.entity';

// describe('employeeSkillService', () => {
//   let service: employeeSkillService;
//   let tenantRepositoryMock: Partial<Record<keyof Repository<Tenant>, jest.Mock>>;
//   let employeeSkillQueriesServiceMock: Partial<Record<keyof employeeSkillQueriesService, jest.Mock>>;
//   let skillsQueriesServiceMock: Partial<Record<keyof SkillsQueriesService, jest.Mock>>;

//   beforeEach(async () => {
//     tenantRepositoryMock = {
//       findOne: jest.fn(),
//     };

//     employeeSkillQueriesServiceMock = {
//       getEmployeeSkillByName: jest.fn(),
//       createEmployeeSkill: jest.fn(),
//       deleteEmployeeSkill: jest.fn(),
//     };

//     skillsQueriesServiceMock = {
//       checkSkillName: jest.fn(),
//       createSkill: jest.fn(),
//     };

//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         employeeSkillService,
//         { provide: Repository, useValue: tenantRepositoryMock },
//         { provide: employeeSkillQueriesService, useValue: employeeSkillQueriesServiceMock },
//         { provide: SkillsQueriesService, useValue: skillsQueriesServiceMock },
//       ],
//     }).compile();

//     service = module.get<employeeSkillService>(employeeSkillService);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('createEmployeeSkill', () => {
//     it('should create employee skill successfully', async () => {
//       const tenantCode = 'TestTenant';
//       const userData = {
//         skill_name: 'NewSkill',
//         employee_id: '123',
//         studio: 'TestStudio',
//       };

//       const tenantMock = new Tenant();
//       tenantMock.tenant_name = 'TestTenant';

//       tenantRepositoryMock.findOne.mockResolvedValue(tenantMock);
//       skillsQueriesServiceMock.checkSkillName.mockResolvedValue([]);
//       employeeSkillQueriesServiceMock.getEmployeeSkillByName.mockResolvedValue([]);
//       employeeSkillQueriesServiceMock.createEmployeeSkill.mockResolvedValue({});
//       employeeSkillQueriesServiceMock.getEmployeeSkillByName.mockResolvedValue([userData]);

//       const result = await service.createEmployeeSkill(tenantCode, userData);

//       expect(result).toEqual({
//         message: 'employeeSkill created successfully and data saved.',
//         data: [userData],
//       });

//       expect(tenantRepositoryMock.findOne).toHaveBeenCalledWith({ where: { tenant_code: tenantCode } });
//       expect(skillsQueriesServiceMock.checkSkillName).toHaveBeenCalledWith('TestTenant', userData);
//       expect(employeeSkillQueriesServiceMock.getEmployeeSkillByName).toHaveBeenCalledWith('TestTenant', userData.skill_name);
//       expect(employeeSkillQueriesServiceMock.createEmployeeSkill).toHaveBeenCalledWith('TestTenant', userData);
//     });

//     it('should throw NotFoundException when tenant is not found', async () => {
//       const tenantCode = 'NonExistentTenant';
//       const userData = {
//         skill_name: 'NewSkill',
//         employee_id: '123',
//         studio: 'TestStudio',
//       };

//       tenantRepositoryMock.findOne.mockResolvedValue(undefined);

//       await expect(service.createEmployeeSkill(tenantCode, userData)).rejects.toThrowError(NotFoundException);
//     });

//     it('should throw BadRequestException when employeeSkill with the same name already exists', async () => {
//       const tenantCode = 'TestTenant';
//       const userData = {
//         skill_name: 'ExistingSkill',
//         employee_id: '123',
//         studio: 'TestStudio',
//       };

//       const tenantMock = new Tenant();
//       tenantMock.tenant_name = 'TestTenant';

//       tenantRepositoryMock.findOne.mockResolvedValue(tenantMock);
//       skillsQueriesServiceMock.checkSkillName.mockResolvedValue([userData]);

//       await expect(service.createEmployeeSkill(tenantCode, userData)).rejects.toThrowError(BadRequestException);
//     });
//   });

//   describe('GetEmployeeSkillByName', () => {
//     it('should return message when employeeSkill with name can be created', async () => {
//       const tenantCode = 'TestTenant';
//       const userData = {
//         skill_name: 'NewSkill',
//       };

//       const tenantMock = new Tenant();
//       tenantMock.tenant_name = 'TestTenant';

//       tenantRepositoryMock.findOne.mockResolvedValue(tenantMock);
//       employeeSkillQueriesServiceMock.getEmployeeSkillByName.mockResolvedValue([]);

//       const result = await service.GetEmployeeSkillByName(tenantCode, userData);

//       expect(result).toEqual({ message: 'employeeSkill with this name can be created' });
//       expect(employeeSkillQueriesServiceMock.getEmployeeSkillByName).toHaveBeenCalledWith('TestTenant', userData.skill_name);
//     });

//     it('should throw NotFoundException when tenant is not found', async () => {
//       const tenantCode = 'NonExistentTenant';
//       const userData = {
//         skill_name: 'NewSkill',
//       };

//       tenantRepositoryMock.findOne.mockResolvedValue(undefined);

//       await expect(service.GetEmployeeSkillByName(tenantCode, userData)).rejects.toThrowError(NotFoundException);
//     });

//     it('should throw BadRequestException when employeeSkill with the same name already exists', async () => {
//       const tenantCode = 'TestTenant';
//       const userData = {
//         skill_name: 'ExistingSkill',
//       };

//       const tenantMock = new Tenant();
//       tenantMock.tenant_name = 'TestTenant';

//       tenantRepositoryMock.findOne.mockResolvedValue(tenantMock);
//       employeeSkillQueriesServiceMock.getEmployeeSkillByName.mockResolvedValue([userData]);

//       await expect(service.GetEmployeeSkillByName(tenantCode, userData)).rejects.toThrowError(BadRequestException);
//     });
//   });

//   describe('getEmployeeSkillByEmployeeId', () => {
//     it('should return employee skill by employee id', async () => {
//       const tenantCode = 'TestTenant';
//       const employee_id = '123';
//       const employeeSkillData = [{ id: '1', skill_name: 'Skill1' }];

//       const tenantMock = new Tenant();
//       tenantMock.tenant_name = 'TestTenant';

//       tenantRepositoryMock.findOne.mockResolvedValue(tenantMock);
//       employeeSkillQueriesServiceMock.getEmployeeSkillByEmployeeId.mockResolvedValue(employeeSkillData);

//       const result = await service.getEmployeeSkillByEmployeeId(employee_id, tenantCode);

//       expect(result).toEqual({
//         message: 'employeeSkill retrieved successfully.',
//         data: employeeSkillData,
//       });
//       expect(employeeSkillQueriesServiceMock.getEmployeeSkillByEmployeeId).toHaveBeenCalledWith('TestTenant', employee_id);
//     });

//     it('should throw NotFoundException when tenant is not found', async () => {
//       const tenantCode = 'NonExistentTenant';
//       const employee_id = '123';

//       tenantRepositoryMock.findOne.mockResolvedValue(undefined);

//       await expect(service.getEmployeeSkillByEmployeeId(employee_id, tenantCode)).rejects.toThrowError(NotFoundException);
//     });

//     it('should throw NotFoundException when employee skill is not found', async () => {
//       const tenantCode = 'TestTenant';
//       const employee_id = '123';

//       const tenantMock = new Tenant();
//       tenantMock.tenant_name = 'TestTenant';

//       tenantRepositoryMock.findOne.mockResolvedValue(tenantMock);
//       employeeSkillQueriesServiceMock.getEmployeeSkillByEmployeeId.mockResolvedValue([]);

//       await expect(service.getEmployeeSkillByEmployeeId(employee_id, tenantCode)).rejects.toThrowError(NotFoundException);
//     });
//   });

//   describe('deleteEmployeeSkill', () => {
//     it('should delete employee skill successfully', async () => {
//       const tenantCode = 'TestTenant';
//       const id = '1';
//       const level = '1';

//       const tenantMock = new Tenant();
//       tenantMock.tenant_name = 'TestTenant';

//       tenantRepositoryMock.findOne.mockResolvedValue(tenantMock);

//       const result = await service.deleteEmployeeSkill(id, level, tenantCode);

//       expect(result).toEqual({ message: 'employeeSkill deleted successfully.' });
//       expect(employeeSkillQueriesServiceMock.deleteEmployeeSkill).toHaveBeenCalledWith('TestTenant', id, level);
//     });

//     it('should throw NotFoundException when tenant is not found', async () => {
//       const tenantCode = 'NonExistentTenant';
//       const id = '1';
//       const level = '1';

//       tenantRepositoryMock.findOne.mockResolvedValue(undefined);

//       await expect(service.deleteEmployeeSkill(id, level, tenantCode)).rejects.toThrowError(NotFoundException);
//     });
//   });
// });
