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
export class PracticeQueriesService {
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

  async createPractice(tenantName: string, practiceData: any): Promise<any> {
    const query = `
      INSERT INTO public.practice (title, description, total_employee, studio_head, code, location, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *;
    `;
    const code = Math.floor(Math.random() * 9000) + 1000;
    const values = [
      practiceData.title,
      practiceData.description,
      practiceData.total_employee,
      practiceData.studio_head,
      code,
      practiceData.location,
    ];
    return this.executeQuery(tenantName, query, values);
  }

  async getPracticeById(tenantName: string, id: string): Promise<any> {
    const query = `
      SELECT * FROM public.practice
      WHERE id = $1;
    `;
    const values = [id];
    return this.executeQuery(tenantName, query, values);
  }

  async getAllPractices(tenantName: string): Promise<any> {
    const query = `
      SELECT * FROM public.practice;
    `;
    return this.executeQuery(tenantName, query);
  }

  async updatePractice(
    tenantName: string,
    id: string,
    practiceData: any,
  ): Promise<any> {
    const query = `
      UPDATE public.practice
      SET title = $1, description = $2, total_employee = $3, studio_head = $4, image = $5,location = $6, updated_at = NOW()
      WHERE id = $7
      RETURNING *;
    `;
    const values = [
      practiceData.title,
      practiceData.description,
      practiceData.total_employee,
      practiceData.studio_head,
      practiceData.image || '',
      practiceData.location,
      id,
    ];
    return this.executeQuery(tenantName, query, values);
  }

  async deletePractice(tenantName: string, id: string): Promise<any> {
    const query = `
      DELETE FROM public.practice
      WHERE id = $1;
    `;
    const values = [id];
    return this.executeQuery(tenantName, query, values);
  }

  async checkPracticeName(tenantName: string, title: string): Promise<any> {
    const query = `
    SELECT * FROM public.practice
    WHERE title ILIKE $1;
    
    `;
    const values = [title];
    return this.executeQuery(tenantName, query, values);
  }
}
