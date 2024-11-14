import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Tenant } from './tenant.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async createTenant(tenantData: {
    tenant_name: string;
    tenant_email: string;
    role: string;
    tenant_code: string;
    password: string;
    status: string;
    phone?: string;
    location?: string;
    subscription_details?: string[];
    company_type?: string;
    image?: string;
    isRegistered?: boolean;
  }): Promise<{ message: string; data?: Tenant }> {
    // Check if tenant with the same name already exists
    const existingTenantName = await this.tenantRepository.findOne({
      where: { tenant_name: tenantData.tenant_name },
    });
    if (existingTenantName) {
      return {
        message: `Tenant with name '${tenantData.tenant_name}' already exists.`,
        data: undefined,
      };
    }

    // Check if tenant with the same email already exists
    const existingTenantEmail = await this.tenantRepository.findOne({
      where: { tenant_email: tenantData.tenant_email },
    });
    if (existingTenantEmail) {
      return {
        message: `Tenant with email '${tenantData.tenant_email}' already exists.`,
        data: undefined,
      };
    }
    const hashPassword = (password) => {
      try {
        return bcrypt.hash(password, 10);
      } catch (err) {
        throw new Error(`Error in password encryption: ${err.message}`);
      }
    };
    tenantData.password = await hashPassword(tenantData.password);

    if (tenantData.isRegistered) {
      tenantData.status = 'pending';
    }

    // Check if tenant with the same tenant_code already exists
    let tenantCode: string;
    let existingTenantCode: Tenant | undefined;

    do {
      tenantCode = Math.floor(1000 + Math.random() * 9000).toString(); // Generates a random 4-digit number
      existingTenantCode = await this.tenantRepository.findOne({
        where: { tenant_code: tenantCode },
      });
    } while (existingTenantCode);

    const tenant = new Tenant();
    tenant.tenant_name = tenantData.tenant_name.toLocaleLowerCase();
    tenant.tenant_email = tenantData.tenant_email;
    tenant.role = tenantData.role;
    tenant.tenant_code = tenantCode;
    tenant.password = await bcrypt.hash(tenantData.password, 10);
    tenant.status = tenantData.status;
    tenant.location = tenantData.location;
    tenant.subscription_details = tenantData.subscription_details;
    tenant.company_type = tenantData.company_type;
    tenant.image = tenantData.image;
    tenant.isRegistered = tenantData.isRegistered;

    await this.tenantRepository.save(tenant);

    await this.createDatabase(tenant.tenant_name);

    await this.addTenantConfig(tenant.tenant_name);

    return { message: 'Tenant created successfully.', data: tenant };
  }

  private async createDatabase(databaseName: string): Promise<void> {
    const queryRunner =
      this.tenantRepository.manager.connection.createQueryRunner();
    let connection;

    try {
      await queryRunner.connect();
      connection = this.tenantRepository.manager.connection;
      await queryRunner.query(`CREATE DATABASE "${databaseName}";`);
      const newConnection = await this.createConnectionToDatabase(databaseName); 

      const newQueryRunner = newConnection.createQueryRunner();
      await newQueryRunner.connect();
      await newQueryRunner.query(`
        CREATE TABLE IF NOT EXISTS public.employee (
          id SERIAL PRIMARY KEY,
          first_name VARCHAR(255) NOT NULL,
          last_name VARCHAR(255),
          designation VARCHAR(255),
          role VARCHAR(255),
          gender VARCHAR(255),
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          image VARCHAR(255),
          location VARCHAR(255),
          marital_status VARCHAR(255),
          blood_group VARCHAR(255),
          phy_disable VARCHAR(255),
          pan_card VARCHAR(255),
          aadhaar_card VARCHAR(255),
          uan VARCHAR(255),
          personal_email VARCHAR(255),
          phone VARCHAR(255),
          whatsapp VARCHAR(255),
          wordpress VARCHAR(255),
          github VARCHAR(255),
          bitbucket VARCHAR(255),
          work_phone VARCHAR(255),
          address VARCHAR(255),
          tenant_id INTEGER NOT NULL,
          studio_name VARCHAR(255),
          project INTEGER,
          status VARCHAR(255) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        ALTER TABLE IF EXISTS public.employee OWNER TO postgres;
      `);
 
      await newQueryRunner.query(`
        CREATE TABLE IF NOT EXISTS public.practice (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        total_employee INTEGER,
        status VARCHAR(255) DEFAULT 'active',
        studio_head VARCHAR(255),
        location VARCHAR(255),
        code VARCHAR(255),
        image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );
      `);

      await newQueryRunner.query(`
        CREATE TABLE IF NOT EXISTS public.competency (
          id SERIAL PRIMARY KEY,
          competency_name VARCHAR(255) NOT NULL, 
          competency_code VARCHAR(255) NOT NULL,
          competency_admin_email VARCHAR(255) NOT NULL, 
          status VARCHAR(255), 
          total_project INTEGER,
          competency_head INTEGER,
          description TEXT,
          image TEXT, 
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      
      
      await newQueryRunner.query(
        `CREATE TABLE IF NOT EXISTS public.competency_skills (
         id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          technology VARCHAR(255),
          role VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
           updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
        `,
      );

      await newQueryRunner.query(`
        CREATE TABLE IF NOT EXISTS public.employee_skills(
        id SERIAL PRIMARY KEY,
        employee_id INTEGER NOT NULL,
        skill_id INTEGER,
        skill_name VARCHAR(255) NOT NULL,
        level INTEGER NOT NULL,
        studio_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        ALTER TABLE IF EXISTS public.employee_skills
        OWNER TO postgres;
      `
      );

      await newQueryRunner.query(
        `CREATE TABLE IF NOT EXISTS public.project(
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        timeline VARCHAR(255),
        project_manager INTEGER,
        team_lead INTEGER,
        developers INTEGER[],
        project_date VARCHAR(255),
        status VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        );
        `,
      );

      await newQueryRunner.query(
        `CREATE TABLE IF NOT EXISTS public.skill (
         id SERIAL PRIMARY KEY,
         skill_name VARCHAR(255) NOT NULL, 
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );
        `,
      );

      await newQueryRunner.query(
        `CREATE TABLE IF NOT EXISTS public.designation(
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL, 
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );
        `,
      );

      await newQueryRunner.query(
        `CREATE TABLE iF NOT EXISTS public.project_employees(
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL,
        employee_id INTEGER NOT NULL,
        role VARCHAR(255),
        billable BOOLEAN,
        billable_percentage VARCHAR (255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `,
      );

      await newQueryRunner.query(`
        CREATE TABLE IF NOT EXISTS public.access_labels (
          id SERIAL PRIMARY KEY,
          employee_id INTEGER NOT NULL,
           isEmployeeCreate BOOLEAN,
           isEmployeeUpdate BOOLEAN,
           isEmployeeRead BOOLEAN,
           isEmployeeDelete BOOLEAN,
           isProjectCreate BOOLEAN,
           isProjectUpdate BOOLEAN,
           isProjectRead BOOLEAN,
           isProjectDelete BOOLEAN,
           isCompetencyCreate BOOLEAN,
           isCompetencyRead BOOLEAN,
           isCompetencyUpdate BOOLEAN,
           isCompetencyDelete BOOLEAN,
           isPracticeCreate BOOLEAN,
           isPracticeRead BOOLEAN,
           isPracticeUpdate BOOLEAN,
           isPracticeDelete BOOLEAN,
           isCsvUpload BOOLEAN,
           isProfileUpdate BOOLEAN,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      console.log(
        `Database '${databaseName}' created successfully.`,
      );
    } catch (err) {
      console.error('Error creating database or table:', err);
    } finally {
      if (queryRunner) {
        await queryRunner.release();
      }
      if (connection && connection.isConnected) {
        await connection.close();
      }
    }
  }

  private async createConnectionToDatabase(
    databaseName: string,
  ): Promise<DataSource> {
    const newDataSource = new DataSource({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: databaseName,
    });

    await newDataSource.initialize();
    return newDataSource;
  }

  private async addTenantConfig(databaseName: string): Promise<void> {
    const dbConfigPath = path.join(__dirname, '../../src/dbConfig.json');
    try {
      const data = fs.readFileSync(dbConfigPath, 'utf8');
      let config;

      try {
        config = JSON.parse(data);
        if (!config.tenants || !Array.isArray(config.tenants)) {
          config.tenants = [];
        }
      } catch (err) {
        config = { tenants: [] };
      }

      const newTenantConfig = {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'root',
        database: databaseName,
      };

      config.tenants.push(newTenantConfig);

      fs.writeFileSync(dbConfigPath, JSON.stringify(config, null, 2), 'utf8');
      console.log('Tenant configuration added successfully');
    } catch (err) {
      console.error('Error adding tenant configuration:', err);
      throw new Error('Failed to add tenant configuration');
    }
  }
}
