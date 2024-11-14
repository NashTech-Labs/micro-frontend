import { Injectable } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import dbConfig from '../dbConfig.json';
import { CompetencyQueriesService } from 'src/competency/competencyQueries.service';

interface TenantConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

@Injectable()
export class fileQueriesService {
  constructor(
    private readonly competencyQueriesService: CompetencyQueriesService,
  ) {}
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

  async checkEmployee(
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
      if (studio.length == 0) {
        return {
          message: 'Studio does not exist, please use existing studio',
        };
      }
    }
  }

  
}
