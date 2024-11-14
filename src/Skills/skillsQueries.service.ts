import { Injectable } from '@nestjs/common';
import { Pool, PoolClient } from 'pg'
import dbConfig from '../dbConfig.json'; 

interface TenantConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

@Injectable()
export class SkillsQueriesService {
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
      await pool.end(); // Close the pool after executing the query
    }
  }

  // Method to check if a competency with the same name already exists
  async checkSkillName(
    tenantName: string,
    competencyName: string,
  ): Promise<any> {
    const query = `
      SELECT * FROM public.skills
      WHERE skill_name = $1
    `;
    return this.executeQuery(tenantName, query, [competencyName]);
  }

  // Method to create a new competency
  async createSkill(
    tenantName: string,
    userData: any,
  ): Promise<any> {
    const query = `
      INSERT INTO public.skills (
        skill_name,
        created_at,
        updated_at
      ) VALUES (
        $1, NOW(), NOW()
      )
    `;
    const values = [
    
      userData.skill_name,
     
    ];
    return this.executeQuery(tenantName, query, values);
  }

  // Method to get all competencies
  async getAllSkills(tenantName: string): Promise<any> {
    const query = `
      SELECT * FROM public.skills
    `;
    return this.executeQuery(tenantName, query);
  }

  // Method to get a competency by ID
  async getSkillById(tenantName: string, id: string): Promise<any> {
    const query = `
      SELECT * FROM public.skills
      WHERE id = $1
    `;
    return this.executeQuery(tenantName, query, [id]);
  }


}
