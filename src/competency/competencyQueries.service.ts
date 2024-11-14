import { Injectable } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import dbConfig from '../dbConfig.json';

interface TenantConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl?: {
    rejectUnauthorized: boolean;
  };
}

@Injectable()
export class CompetencyQueriesService {
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

  // Method to check if a competency with the same name already exists
  async checkCompetencyName(
    tenantName: string,
    competencyName: string,
  ): Promise<any> {
    const query = `
      SELECT * FROM public.competency
      WHERE competency_name = $1
    `;
    return this.executeQuery(tenantName, query, [competencyName]);
  }

  // Method to create a new competency
  async createCompetency(
    tenantName: string,
    userData: any,
    code: number,
  ): Promise<any> {
    const query = `
      INSERT INTO public.competency (
        competency_name,
        competency_code,
        competency_admin_email,
        status,
        total_project,
        total_employee,
        competency_head,
        description,
        created_at,
        updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()
      )
    `;
    const values = [
      userData.competency_name,
      code,
      userData.competency_admin_email,
      userData.status,
      userData.total_project,
      userData.total_employee,
      userData.competency_head,
      userData.description,
    ];
    return this.executeQuery(tenantName, query, values);
  }

  // Method to get all competencies
  async getAllCompetencies(tenantName: string): Promise<any> {
    const query = `
      SELECT * FROM public.competency
    `;
    return this.executeQuery(tenantName, query);
  }

  // Method to get a competency by ID
  async getCompetencyById(tenantName: string, id: string): Promise<any> {
    const query = `
      SELECT * FROM public.competency
      WHERE id = $1
    `;
    return this.executeQuery(tenantName, query, [id]);
  }

  // Method to update a competency
  async updateCompetency(
    tenantName: string,
    id: string,
    userData: any,
  ): Promise<any> {
    const query = `
      UPDATE public.competency
      SET
        competency_name = $1,
        competency_code = $2,
        competency_admin_email = $3,
        status = $4,
        total_project = $5,
        total_employee = $6,
        competency_head = $7,
        description = $8,
        image = $9,
        updated_at = NOW()
      WHERE id = $10
    `;
    const values = [
      userData.competency_name,
      userData.competency_code,
      userData.competency_admin_email,
      userData.status,
      userData.total_project,
      userData.total_employee,
      userData.competency_head,
      userData.description,
      userData.image || '',
      id,
    ];
    return this.executeQuery(tenantName, query, values);
  }

  // Method to delete a competency
  async deleteCompetency(tenantName: string, id: string): Promise<any> {
    const query = `
      DELETE FROM public.competency
      WHERE id = $1
    `;
    return this.executeQuery(tenantName, query, [id]);
  }
}
