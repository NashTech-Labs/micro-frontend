import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as Joi from 'joi';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { accessLabelService } from 'src/accesslabels/access.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class LoginService {
  private readonly pool: Pool;

  constructor(
    private readonly jwtService: JwtService,
    private readonly accessLabelService: accessLabelService, // Correctly inject the service here
    private readonly UserService: UserService,
  ) {
    this.pool = new Pool({
      user: 'postgres',
      host: 'eventx.c7uswg62u6zg.eu-north-1.rds.amazonaws.com',
      database: 'eventxbe',
      password: 'india0192',
      port: 5432,
      ssl: {
        rejectUnauthorized: false,
      }, 
       // Default PostgreSQL port
    });
  }

  async login(body: {
    email: string;
    password: string;
    role: string;
    tenant_code?: string;
    domain?: string;
  }): Promise<any> {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      role: Joi.string().required(),
      tenant_code: Joi.when('role', {
        is: Joi.string().valid('employee'),
        then: Joi.string().required(),
        otherwise: Joi.string().optional(),
      }),
    });

    const { error } = schema.validate(body);
    if (error) {
      throw new BadRequestException(error.details[0].message);
    }

    try {
      if (body.role == 'super admin') {
        return this.adminLogin(body);
      } else if (body.role === 'admin') {
        return this.tenantLogin(body);
      } else if (body.role === 'employee') {
        if (!body.tenant_code) {
          throw new NotFoundException('Tenant code Not Found');
        }
        return this.employeeLogin(body);
      } else {
        throw new BadRequestException('User not found');
      }
    } catch (err) {
      throw new BadRequestException('User not found', err.message);
    }
  }

  async tenantLogin(body: { email: string; password: string }): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM tenant WHERE tenant_email = $1',
        [body.email],
      );
      if (result.rows.length === 0) {
        throw new BadRequestException('Tenant does not exist');
      }

      const tenant = result.rows[0];
      if (!bcrypt.compareSync(body.password, tenant.password)) {
        throw new BadRequestException('Incorrect password');
      }

      let access = {
        "employee_id" : null,
      "isemployeecreate": true,
        "isemployeeupdate" : true,
        "isemployeeread" : true,
        "isemployeedelete" : true,
        "isprojectcreate" : true,
        "isprojectupdate" : true,
        "isprojectread" : true,
        "isprojectdelete" : true,
        "iscompetencycreate" : true,
        "iscompetencyread" : true,
        "iscompetencyupdate": true,
        "iscompetencydelete" : true,
        "ispracticecreate": true,
        "ispracticeread" : true,
        "ispracticeupdate": true,
        "ispracticedelete": true,
        "iscsvupload": true,
        "isprofileupdate": true,
      }

      // Generate JWT token
      const token = this.jwtService.sign({
        email: tenant.email,
        id: tenant.id,
        code: tenant.code,
        role: 'admin',
        labels : access,
      });

      // Remove the password from the tenant object
      delete tenant.password;

      // Merge the token into the tenant object
      const tenantDetail = { ...tenant, token };

      return { message: 'Tenant login successful', user: tenantDetail };
    } catch (error) {
      throw new BadRequestException(error.message);
    } finally {
      client.release();
    }
  }

  async employeeLogin(body: {
    email: string;
    password: string;
    tenant_code?: string;
  }): Promise<any> {
    try {
      const client = await this.pool.connect();
      const tenantResult = await client.query(
        'SELECT * FROM tenant WHERE tenant_code = $1',
        [body.tenant_code],
      );
      if (tenantResult.rows.length > 0) {
        const tenant = tenantResult.rows[0];

        const employees = await this.UserService.checkUsersByEmail(
          body.email,
          tenant.tenant_code,
        );

        if (!employees.data) {
          throw new BadRequestException('Employee not found');
        }

        const employee = employees.data;
        if (!bcrypt.compareSync(body.password, employee.password)) {
          throw new BadRequestException('Incorrect password');
        }
        let access = await this.accessLabelService.getAccessByEmployeeId(
          employee.id,
          body.tenant_code,
        );

        // Generate JWT token
        const token = this.jwtService.sign({
          email: employee.email,
          id: employee.id,
          code: tenant.code,
          role: 'employee',
          labels : access
        });

        // Remove the password from the employee object
        delete employee.password;
        employee['tenant_code'] = body.tenant_code;
        
        // Merge the token into the employee object
        const employeeDetail = { ...employee, token };
        return {
          message: 'Employee login successful',
          user: employeeDetail,
        };
      } else {
        throw new BadRequestException('User not found');
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async adminLogin(body: { email: string; password: string }): Promise<any> {
    const client = await this.pool.connect();
    try {
      const query = `SELECT * FROM admin WHERE email = $1`;
      const result = await client.query(query, [body.email]);

      if (result.rows.length === 0) {
        throw new BadRequestException('Admin with this email not found');
      }

      const admin = result.rows[0];
      if (!bcrypt.compareSync(body.password, admin.password)) {
        throw new BadRequestException('Incorrect password');
      }

      // Generate JWT token
      const token = this.jwtService.sign({
        email: admin.email,
        id: admin.id,
        role: 'super admin',
      
      });

      // Remove the password from the admin object
      delete admin.password;

      // Merge the token into the admin object
      const adminWithToken = { ...admin, token };

      return { message: 'Admin login successful', user: adminWithToken };
    } finally {
      client.release();
    }
  }
}
