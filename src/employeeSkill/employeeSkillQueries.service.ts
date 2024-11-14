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
export class employeeSkillQueriesService {
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

  // Method to check if a employeeSkill with the same name already exists
  async checkEmployeeSkillByNameAndLevel(
    tenantName: string,
    skillName: string,
    employee_id: string,
    level: string,
  ): Promise<any> {
    const query = `
      SELECT * FROM public.employee_skills WHERE skill_name = $1
      AND employee_id = $2
      AND level = $3
     
    `;
    return this.executeQuery(tenantName, query, [
      skillName,
      employee_id,
      level
     
    ]);
  }

  // Method to check if a employeeSkill with the same name already exists
  async checkEmployeeSkillByNameAndEmployeeAndStudio(
    tenantName: string,
    skillName: string,
    employee_id:string,
    studio_id : string
  ): Promise<any> {

    const query = `
      SELECT * FROM public.employee_skills WHERE skill_name = $1
            AND employee_id = $2
            AND studio_id = $3


    `;
    return this.executeQuery(tenantName, query, [
      skillName,
      employee_id,
      studio_id
     
    ]);
  }

  // Method to create a new employeeSkill
  async createEmployeeSkill(tenantName: string, userData: any): Promise<any> {
    const query = `
      INSERT INTO public.employee_skills(
      skill_name,
        employee_id,
        studio_id,
        level,
        created_at,
        updated_at
      ) VALUES (
        $1, $2, $3,$4, NOW(), NOW()
      )
    `;
    const values = [
      userData.skill_name,
      userData.employee_id,
      userData.studio_id,
      userData.level,
    ];
    return this.executeQuery(tenantName, query, values);
  }

  

  // Method to get a employeeSkill by ID
  async getEmployeeSkillByEmployeeId(
    tenantName: string,
    employee_id: string,
  ): Promise<any> {
    let query = `SELECT * FROM public.employee_skills
    WHERE employee_id = $1`;
    let data = await this.executeQuery(tenantName, query, [employee_id]);
    return data;
  }


  async getAllEmployeeSkills(
    tenantName: string,
  ): Promise<any> {
    let query = `SELECT * FROM public.employee_skills`;
    let data = await this.executeQuery(tenantName, query, []);
    return data;
  }

  // Method to delete a employeeSkill
  async deleteEmployeeSkill(
    tenantName: string,
    id: string,
  ): Promise<any> {
    const query = `
      DELETE FROM public.employee_skills
      WHERE id = $1
    `;
    return this.executeQuery(tenantName, query, [id]);
  }
}
