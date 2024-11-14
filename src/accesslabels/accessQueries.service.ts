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
export class accessLabelQueriesService {
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

  async createAccess(tenantName: string, accessData: any): Promise<any> {
    const query = `
      INSERT INTO public.access_labels (employee_id,
      isemployeecreate,
      isemployeeupdate,
      isemployeeread,
      isemployeedelete, 
      isprojectcreate,
      isprojectupdate,
      isprojectread, 
      isprojectdelete,
      iscompetencycreate,
      iscompetencyread,
      iscompetencyupdate,
      iscompetencydelete,
      ispracticecreate,
      ispracticeread,
      ispracticeupdate,
      ispracticedelete,
      iscsvupload,
      isprofileupdate, 
      created_at,
      updated_at)
      VALUES ($1, $2, $3, $4, $5, $6,$7, $8,$9, $10, $11, $12, $13, $14, $15, $16, $17,$18,$19, NOW(), NOW())
      RETURNING *;
    `;
    const values = [
      accessData.employee_id,
      accessData.isemployeecreate,
      accessData.isemployeeupdate,
      accessData.isemployeeread,
      accessData.isemployeedelete,
      accessData.isprojectcreate,
      accessData.isprojectupdate,
      accessData.isprojectread,
      accessData.isprojectdelete,
      accessData.iscompetencycreate,
      accessData.iscompetencyread,
      accessData.iscompetencyupdate,
      accessData.iscompetencydelete,
      accessData.ispracticecreate,
      accessData.ispracticeread,
      accessData.ispracticeupdate,
      accessData.ispracticedelete,
      accessData.iscsvupload,
      accessData.isprofileupdate,
    ];
    return this.executeQuery(tenantName, query, values);
  }

  async getAccessByEmployeeId(tenantName: string, id: string): Promise<any> {
    const query = `
      SELECT * FROM public.access_labels
      WHERE employee_id = $1;
    `;
    const values = [id];
    return this.executeQuery(tenantName, query, values);
  }

  async getAllAccess(tenantName: string): Promise<any> {
    const query = `
      SELECT * FROM public.access_labels;
    `;
    return this.executeQuery(tenantName, query);
  }

  async updateAccessByEmployeeId(
    tenantName: string,
    id: string,
    accessData: any,
  ): Promise<any> {
    const query = `
      UPDATE public.access_labels
      SET 

      isemployeecreate = $1,
      isemployeeupdate  = $2,
      isemployeeread  = $3,
      isemployeedelete  = $4, 
      isprojectcreate = $5,
      isprojectupdate  = $6,
      isprojectread  = $7, 
      isprojectdelete  = $8,
      iscompetencycreate =$9,
      iscompetencyread =$10 ,
      iscompetencyupdate =$11,
      iscompetencydelete=$12,
      ispracticecreate=$13,
      ispracticeread=$14,
      ispracticeupdate=$15,
      ispracticedelete =$16,
      iscsvupload=$17,
      isprofileupdate=$18, 
       updated_at = NOW()
      WHERE employee_id = $19
      RETURNING *;
    `;
    const values = [
      accessData.isemployeecreate,
      accessData.isemployeeupdate,
      accessData.isemployeeread,
      accessData.isemployeedelete,
      accessData.isprojectcreate,
      accessData.isprojectupdate,
      accessData.isprojectread,
      accessData.isprojectdelete,
      accessData.iscompetencycreate,
      accessData.iscompetencyread,
      accessData.iscompetencyupdate,
      accessData.iscompetencydelete,
      accessData.ispracticecreate,
      accessData.ispracticeread,
      accessData.ispracticeupdate,
      accessData.ispracticedelete,
      accessData.iscsvupload,
      accessData.isprofileupdate,
      id
    ];
    return await this.executeQuery(tenantName, query, values);
  }

  
}
