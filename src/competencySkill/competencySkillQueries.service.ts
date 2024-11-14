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

  async checkEmployeeSkillByName(
    tenantName: string,
    skillName: string,
    employee_id: string,
    level: string,
  ): Promise<any> {
    const query = `
      SELECT * FROM public.employee_skills WHERE skill_name = $1
      AND employee_id = $2
      AND level= $3
    `;
    return this.executeQuery(tenantName, query, [
      skillName,
      employee_id,
      level,
    ]);
  }

  async getSkillsBySkillName(
    tenantName: string,
    skill_name: string,
  ): Promise<any> {
    let query = `SELECT * FROM public.employee_skills
    WHERE skill_name = $1`;

    let data = await this.executeQuery(tenantName, query, [skill_name]);
    return data;
  }

  async getSkillsByLevel(
    tenantName: string,
    skill_name: string,
    level: string,
  ): Promise<any> {
    let query = `SELECT * FROM public.employee_skills
    WHERE skill_name = $1 AND level = $2`;
    let data = await this.executeQuery(tenantName, query, [skill_name, level]);
    return data;
  }

  async getSkillsByCompetency(
    tenantName: string,
    studio_id: string,
  ): Promise<any> {
    let query = `SELECT * FROM public.employee_skills
    WHERE studio_id = $1`;
    let data = await this.executeQuery(tenantName, query, [studio_id]);
    return data;
  }
}
