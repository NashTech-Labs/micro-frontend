import { Injectable } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import dbConfig from '../dbConfig.json';

interface TenantConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

@Injectable()
export class ProjectQueriesService {
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
      throw new Error(`Failed to execute query: ${error.message}`);
    } finally {
      if (client) {
        client.release();
      }
      await pool.end(); // Close the pool after executing the query
    }
  }

  async checkProjectName(tenantName: string, title: string): Promise<any> {
    const query = `
      SELECT * FROM public.project
      WHERE title = $1
    `;
    return await this.executeQuery(tenantName, query, [title]);
  }

  async createProject(
    tenantName: string,
    userData: any,
    file: string,
  ): Promise<any> {
    const query = `
      INSERT INTO public.project (
        title,
        timeline,
        start_date,
        end_date,
        status,
        description,
        duration,
        file,
        created_at,
        updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,NOW(), NOW()
      )
    `;
    const values = [
      userData.title,
      userData.timeline,
      userData.start_date,
      userData.end_date,
      userData.status,
      userData.description,
      userData.duration,
      file,
    ];

    let see = await this.executeQuery(tenantName, query, values);
  }

  async createProjectEmployee(tenantName: string, userData: any): Promise<any> {
    const query = `
      INSERT INTO public.project_employees (
        project_id,
        employee_id,
        role,
        billable,
        billable_percentage,
        created_at
      ) VALUES (
        $1, $2, $3, $4, $5,NOW()
      )
    `;
    const values = [
      userData.project_id,
      userData.employee_id,
      userData.role,
      userData.billable,
      userData.billable_percentage,
    ];
    return this.executeQuery(tenantName, query, values);
  }

  async addProjectToEmployee (
      tenantName: string,
      id: string,
      project: any
    ): Promise<any> {
      const query = `
        UPDATE public.employees
        SET
          project = $1,
          updated_at = NOW()
        WHERE id = $2
      `;
      const values = [
        project,
        id,
      ];
      return this.executeQuery(tenantName, query, values);
    }

  async getProjectEmployeeByProjectId(
    tenantName: string,
    id: string,
  ): Promise<any> {
    const query = `
      SELECT * FROM public.project_employees
      WHERE project_id = $1 

    `;
    return this.executeQuery(tenantName, query, [id]);
  }

  async getProjectEmployeeByEmployeeId(
    tenantName: string,
    project_id: string,
    employee_id: string,
  ): Promise<any> {
    const query = `
      SELECT * FROM public.project_employees
      WHERE project_id = $1 
      AND employee_id = $2

    `;
    return this.executeQuery(tenantName, query, [project_id, employee_id]);
  }

  async getAllProjects(tenantName: string): Promise<any> {
    const query = `
      SELECT * FROM public.project
    `;
    return this.executeQuery(tenantName, query);
  }

  async getProjectById(tenantName: string, id: string): Promise<any> {
    const query = `
      SELECT * FROM public.project
      WHERE id = $1
    `;
    return this.executeQuery(tenantName, query, [id]);
  }

  async updateProject(
    tenantName: string,
    id: string,
    userData: any,
    file : any
  ): Promise<any> {
    const query = `
      UPDATE public.project
      SET
        title = $1,
        timeline = $2,
        start_date = $3,
        end_date = $4,
        status = $5,
        description  = $6,
        duration = $7,
        file = $8,
         updated_at = NOW()
      WHERE id = $9
     

    `;
    const values = [
      userData.title,
      userData.timeline,
      userData.start_date,
      userData.end_date,
      userData.status,
      userData.description,
      userData.duration,
      file,
      id,
    ];
    return this.executeQuery(tenantName, query, values);
  }

  async updateProjectEmployee(
    tenantName: string,
    id: string,
    userData: any,
  ): Promise<any> {
    const query = `
      UPDATE public.project_employees
      SET
        role = $1,
        billable = $2,
        billable_percentage = $3,
        status = $4,
       
      updated_at = NOW()
       WHERE employee_id = $5

    `;
    const values = [
      userData.role,
      userData.billable,
      userData.billable_percentage,
      userData.status,
      id,
    ];
    return this.executeQuery(tenantName, query, values);
  }

  async deleteProject(tenantName: string, id: string): Promise<any> {
    const query = `
    UPDATE public.project
    SET status = $1,
    updated_at = NOW()
    WHERE id = $2

    `;

    const values = [
     "inactive",
      id,
    ];
    return this.executeQuery(tenantName, query, values);
  }
}
