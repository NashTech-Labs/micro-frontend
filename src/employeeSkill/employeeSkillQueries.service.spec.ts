// import { Test, TestingModule } from '@nestjs/testing';
// import { employeeSkillQueriesService } from './employeeSkillQueries.service';

// describe('employeeSkillQueriesService', () => {
//   let service: employeeSkillQueriesService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [employeeSkillQueriesService],
//     }).compile();

//     service = module.get<employeeSkillQueriesService>(employeeSkillQueriesService);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('getEmployeeSkillByName', () => {
//     it('should return employee skills from beginner table', async () => {
//       const tenantName = 'TestTenant';
//       const skillName = 'TestSkill';
//       const expectedResult = [{ skill_name: skillName }];

//       // Mock the private method executeQuery
//       const executeQueryMock = jest.spyOn(service as any, 'executeQuery');
//       executeQueryMock.mockResolvedValueOnce(expectedResult);

//       const result = await service.getEmployeeSkillByName(tenantName, skillName);

//       expect(result).toEqual(expectedResult);
//       expect(executeQueryMock).toHaveBeenCalledWith(
//         tenantName,
//         expect.any(String),
//         [skillName]
//       );
//     });

//     it('should return employee skills from intermediate table', async () => {
//       const tenantName = 'TestTenant';
//       const skillName = 'TestSkill';
//       const intermediateResult = [{ skill_name: skillName }];
//       const beginnerResult = [];

      
//       jest.spyOn(service as any, 'executeQuery').mockResolvedValueOnce(intermediateResult); // Return from intermediate table

//       const result = await service.getEmployeeSkillByName(tenantName, skillName);

//       expect(result).toEqual(intermediateResult);
      
//     });

//     it('should throw an error when tenant database config is not found', async () => {
//       const tenantName = 'NonExistentTenant';
//       const skillName = 'TestSkill';

//       await expect(service.getEmployeeSkillByName(tenantName, skillName)).rejects.toThrowError(
//         'Tenant database configuration not found.'
//       );
//     });

//     it('should throw an error when executeQuery fails', async () => {
//       const tenantName = 'TestTenant';
//       const skillName = 'TestSkill';
//       const errorMessage = 'Error executing query';

//       // Mock the private method executeQuery to simulate failure
//       jest.spyOn(service as any, 'executeQuery').mockRejectedValueOnce(new Error(errorMessage));

//       await expect(service.getEmployeeSkillByName(tenantName, skillName)).rejects.toThrowError(
//         errorMessage
//       );
//     });
//   });

//   describe('createEmployeeSkill', () => {
//     it('should create employee skill in beginner table', async () => {
//       const tenantName = 'TestTenant';
//       const userData = {
//         skill_name: 'NewSkill',
//         employee_id: '123',
//         studio: 'TestStudio',
//         level: 1,
//       };
//       const expectedResult = {};

//       // Mock the private method executeQuery
//       const executeQueryMock = jest.spyOn(service as any, 'executeQuery');
//       executeQueryMock.mockResolvedValueOnce(expectedResult);

//       const result = await service.createEmployeeSkill(tenantName, userData);

//       expect(result).toEqual(expectedResult);
//       expect(executeQueryMock).toHaveBeenCalledWith(
//         tenantName,
//         expect.any(String),
//         [userData.skill_name, userData.employee_id, userData.studio]
//       );
//     });

//     // Add similar tests for intermediate and proficient levels
//   });

//   describe('getEmployeeSkillByEmployeeId', () => {
//     it('should return skill by employee id', async () => {
//       const tenantName = 'TestTenant';
//       const employeeId = '123';
//       const expectedResult = [{ id: 1, skill_name: 'Skill1' }];

//       // Mock the private method executeQuery
//       const executeQueryMock = jest.spyOn(service as any, 'executeQuery');
//       executeQueryMock.mockResolvedValueOnce(expectedResult);

//       const result = await service.getEmployeeSkillByEmployeeId(tenantName, employeeId);

//       expect(result).toEqual(expectedResult);
//       expect(executeQueryMock).toHaveBeenCalledWith(
//         tenantName,
//         expect.any(String),
//         [employeeId]
//       );
//     });

//     it('should throw an error when tenant database config is not found', async () => {
//       const tenantName = 'NonExistentTenant';
//       const employeeId = '123';

//       await expect(service.getEmployeeSkillByEmployeeId(tenantName, employeeId)).rejects.toThrowError(
//         'Tenant database configuration not found.'
//       );
//     });

//     it('should throw an error when executeQuery fails', async () => {
//       const tenantName = 'TestTenant';
//       const employeeId = '123';
//       const errorMessage = 'Error executing query';

//       // Mock the private method executeQuery to simulate failure
//       jest.spyOn(service as any, 'executeQuery').mockRejectedValueOnce(new Error(errorMessage));

//       await expect(service.getEmployeeSkillByEmployeeId(tenantName, employeeId)).rejects.toThrowError(
//         errorMessage
//       );
//     });
//   });

//   describe('deleteEmployeeSkill', () => {
//     it('should delete employee skill in beginner table', async () => {
//       const tenantName = 'TestTenant';
//       const id = '1';
//       const level = '1';
//       const expectedResult = {};

//       // Mock the private method executeQuery
//       const executeQueryMock = jest.spyOn(service as any, 'executeQuery');
//       executeQueryMock.mockResolvedValueOnce(expectedResult);

//       const result = await service.deleteEmployeeSkill(tenantName, id, level);

//       expect(result).toEqual(expectedResult);
//       expect(executeQueryMock).toHaveBeenCalledWith(
//         tenantName,
//         expect.any(String),
//         [id]
//       );
//     });

//     // Add similar tests for intermediate and proficient levels
//   });
// });
