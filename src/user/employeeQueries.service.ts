import { BadRequestException, Injectable } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import dbConfig from '../dbConfig.json';
import { CompetencyQueriesService } from 'src/competency/competencyQueries.service';
import { accessLabelService } from 'src/accesslabels/access.service';
import { accessLabelQueriesService } from 'src/accesslabels/accessQueries.service';


interface TenantConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

@Injectable()
export class EmployeeQueriesService {
  constructor(
  private readonly competencyQueriesService: CompetencyQueriesService,
  private readonly accessLabelQueriesService : accessLabelQueriesService


  ){}
  private getTenantDbConfig(tenantName: string): TenantConfig | undefined {
    for (const tenant of dbConfig.tenants) {
      if (tenant.database.toLowerCase() === tenantName.toLowerCase()) {
        return tenant;
      }
    }
    return undefined;
  }

  private async executeQuery(
    tenantName: string,
    queryText: string,
    values?: any[],
  ): Promise<any> {
    const tenantDbConfig = this.getTenantDbConfig(tenantName);

    if (!tenantDbConfig) {
      throw new Error('Tenant database configuration not found.');
    }

    const pool = new Pool(tenantDbConfig);

    let client: PoolClient;
    try {
      client = await pool.connect();
      const result = await client.query(queryText, values);
      return result.rows;
    } catch (error) {
      console.error('Error executing query:', error);
      throw new Error(`Failed to execute query: ${error.message}`);
    } finally {
      if (client) {
        client.release();
      }
      await pool.end();
    }
  }

  async getAllEmployees(
    tenantName: string,
  ): Promise<{ message: string; data: any[] }> {
    const query = `
      SELECT * FROM public.employee
    `;
    const employees = await this.executeQuery(tenantName, query);
    return {
      message: 'Retrieved all employees successfully.',
      data: employees,
    };
  }

  async createEmployee(
    tenantName: string,
    employeeData: any,
  ): Promise<{ message: string; data?: any }> {
    const queryCheck = `
      SELECT * FROM public.employee
      WHERE email = $1
    `;
    const checkResult = await this.executeQuery(tenantName, queryCheck, [
      employeeData.email,
    ]);

    if (checkResult.length > 0) {
      return {
        message:
          'User with this email already exists. Please use another email.',
      };
    }
    if (employeeData.studio_name) {
      let studio = await this.competencyQueriesService.checkCompetencyName(
        tenantName,
        employeeData.studio_name,
      );
      if (studio.length > 0) {
       
        if (
          employeeData.competency_head  && employeeData.competency_head == "yes"
        ) {
          let datas = {
            "competency_name": studio[0].competency_name,
            "competency_code": studio[0].competency_code,
            "competency_admin_email": studio[0].competency_admin_email,
            "status": studio[0].status,
            "total_project": studio[0].total_project,
            "total_employee": studio[0].total_employee,
            "competency_head": employeeData.first_name,
            "description": studio[0].description,
            "image": studio[0].image,
          };
          await this.competencyQueriesService.updateCompetency(
            tenantName,
            studio[0].id,
            datas,
          );
        }

        {
        }
      }
    }

    const queryInsert = `
      INSERT INTO public.employee (first_name, designation, role, gender, email, password, studio_name, tenant_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *;
    `;

    const values: (string | number)[] = [
      employeeData.first_name,
      employeeData.designation,
      employeeData.role,
      employeeData.gender,
      employeeData.email,
      employeeData.password,
      employeeData.studio_name,
      employeeData.tenant_id,
    ];

    const insertResult = await this.executeQuery(
      tenantName,
      queryInsert,
      values,
    );
    insertResult[0]['tenant_code'] = employeeData.tenant_code;
    insertResult[0]['tenant_name'] = tenantName;

    let accessLabelsforEmployee = {
      employee_id : insertResult[0].id,
      isemployeecreate : false,
      isemployeeupdate : false,
      isemployeeread: true,
      isemployeedelete : false, 
      isprojectcreate: false,
      isprojectupdate: false,
      isprojectread: true, 
      isprojectdelete: false,
      iscompetencycreate: false,
      iscompetencyread: true,
      iscompetencyupdate : false,
      iscompetencydelete: false,
      ispracticecreate: false,
      ispracticeread: true,
      ispracticeupdate: false,
      ispracticedelete: false,
      iscsvupload: false,
      isprofileupdate: true, 
    }
    const access = []
     await this.accessLabelQueriesService.createAccess(
      tenantName,
      accessLabelsforEmployee
    )
    if(access.length == 0){
      return {
        message: 'User created successfully but access not given',
        data: insertResult[0],
      };
    }
    return {
      message: 'User created successfully and data saved.',
      data: insertResult[0],
    };
  }

  async filterUsersByName(
    tenantName: string,
    name: string,
  ): Promise<{ message: string; data?: any[] }> {
    if (name) {
      const query = `
        SELECT * FROM public.employee WHERE first_name iLIKE '${name}%'
      `;
      const users = await this.executeQuery(tenantName, query);

      return { message: 'Users filtered successfully.', data: users };
    } else {
      return { message: 'Please provide valid name to retrieve a user.' };
    }
  }

  async checkUserByEmail(
    tenantName: string,
    email: string,
  ): Promise<{ message: string; data?: any[] }> {
    const query = 'SELECT * FROM employee WHERE email = $1';
    const result = await this.executeQuery(tenantName, query, [email]);
    if (result.length > 0) {
      return { message: 'Employee with this email already exist', data : result[0] };
    } else {
      return { message: 'Employee can be created with this email' };
    }
  }

  async getUserById(
    tenantName: string,
    id: string,
  ): Promise<{ message: string; data: any }> {
    const query = `SELECT * FROM public.employee WHERE id = $1`;
    const result = await this.executeQuery(tenantName, query, [id]);

    if (result.length === 0) {
      return { message: 'User not found.', data: null };
    }

    return { message: 'User retrieved successfully.', data: result[0] };
  }

  async updateEmployee(
    tenantName: string,
    id: string,
    userData: any,
  ): Promise<{ message: string; data?: any }> {
    const queryCheck = `
      SELECT * FROM public.employee
      WHERE email = $1 AND id <> $2
    `;
    const checkResult = await this.executeQuery(tenantName, queryCheck, [
      userData.email,
      id,
    ]);

    if (checkResult.length > 0) {
      return {
        message:
          'User with this email already exists. Please use another email.',
      };
    }

    const queryUpdate = `
      UPDATE public.employee
      SET
        first_name = $1,
        last_name = $2,
        designation = $3,
        role = $4,
        gender = $5,
        email = $6,
        image = $7,
        location = $8,
        marital_status = $9,
        blood_group = $10,
        phy_disable = $11,
        pan_card = $12,
        aadhaar_card = $13,
        uan = $14,
        personal_email = $15,
        phone = $16,
        whatsapp = $17,
        wordpress = $18,
        github = $19,
        bitbuket = $20,
        work_phone = $21,
        address = $22,
        studio_name = $23
        updated_at = NOW()
      WHERE id = $24
      RETURNING *;
    `;

    const values = [
      userData.first_name,
      userData.last_name,
      userData.designation,
      userData.role,
      userData.gender,
      userData.email,
      userData.image,
      userData.location,
      userData.marital_status,
      userData.blood_group,
      userData.phy_disable,
      userData.pan_card,
      userData.aadhaar_card,
      userData.uan,
      userData.personal_email,
      userData.phone,
      userData.whatsapp,
      userData.wordpress,
      userData.github,
      userData.bitbuket,
      userData.work_phone,
      userData.address,
      userData.studio_name,
      id,
    ];

    const updateResult = await this.executeQuery(
      tenantName,
      queryUpdate,
      values,
    );
    return {
      message: 'User data updated successfully.',
      data: updateResult[0],
    };
  }

  async updateCompetencyAndReporting(
    tenantName: string,
    id: string,
    userData: any,
  ): Promise<{ message: string; data?: any }> {
    const queryCheck = `
      SELECT * FROM public.employee
      WHERE email = $1 AND id <> $2
    `;
    const checkResult = await this.executeQuery(tenantName, queryCheck, [
      userData.email,
      id,
    ]);

    if (checkResult.length > 0) {
      return {
        message:
          'User with this email already exists. Please use another email.',
      };
    }

    const queryUpdate = `
      UPDATE public.employee
      SET
        studio_name = $1,
        reporting_manager = $2,
        updated_at = NOW()
      WHERE id = $3
      RETURNING *;
    `;

    const values = [
      userData.studio_name,
      userData.reporting_manager,
      id,
    ];

    const updateResult = await this.executeQuery(
      tenantName,
      queryUpdate,
      values,
    );
    return {
      message: 'User data updated successfully.',
      data: updateResult[0],
    };
  }

  async updateCompetencyHead(
    tenantName: string,
    id: string,
    data : boolean,
    studio : string
  ): Promise<{message : string, data: any}>{
    const queryUpdate = `
    UPDATE public.employee
    SET
      competency_head = $1,
      studio_name = $2,
      updated_at = NOW()
    WHERE id = $3
    RETURNING *;
  `;

  const values = [
    data,
    studio,
    id,
  ];

  const updateResult = await this.executeQuery(
    tenantName,
    queryUpdate,
    values,
  );
  return {
    message: 'User data updated successfully with competency head.',
    data: updateResult[0],
  };


  }

  async deleteEmployee(
    tenantName: string,
    id: string,
  ): Promise<{ message: string }> {
    const queryDelete = `UPDATE FROM public.employee SET status=$1 WHERE id = $2`;
    await this.executeQuery(tenantName, queryDelete, ["inactive",id]);
    return { message: 'User deleted successfully.' };
  }

  async filterUsersByLocation(
    tenantName: string,
    location: string,
  ): Promise<{ message: string; data: any }> {
    const query = `SELECT * FROM public.employee WHERE location ILIKE $1 || '%'`;
    const result = await this.executeQuery(tenantName, query, [location]);
    return { message: 'Users filtered successfully.', data: result };
  }

  async getAllDesignations(
    tenantName: string,
  ): Promise<{ message: string; data: any[] }> {
    const query = `
    SELECT * FROM public.designation
  `;

    const designation = await this.executeQuery(tenantName, query);
    if (designation.length > 0) {
      return {
        message: 'Retrieved all designation successfully.',
        data: designation,
      };
    }

    const list = [
      'intern',
      'Software Consultant',
      'Senior Software Consultant',
      'AVP',
      'VP',
    ];

    for (const item of list) {
      const queryInsert = `
      INSERT INTO public.designation (title, created_at, updated_at)
      VALUES ($1, NOW(), NOW())
      RETURNING *;
    `;

      const values: (string | number)[] = [item];

      await this.executeQuery(tenantName, queryInsert, values);
    }
    const designations = await this.executeQuery(tenantName, query);
    return {
      message: 'Retrieved all designation successfully.',
      data: designations,
    };
  }
}
