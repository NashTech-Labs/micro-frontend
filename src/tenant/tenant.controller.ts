import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  BadRequestException,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from './tenant.entity';
import { TenantService } from './tenant.service';
import { ApiTags } from '@nestjs/swagger';
import {
  createTenantSwagger,
  updateTenantSwagger,
  deleteTenantSwagger,
  getAllTenantsSwagger,
  createRegisterSwagger
} from './tenant.swagger';
import {
  CreateTenantDto,
  GetTenantByIdDto,
  UpdateTenantDto,
  DeleteTenantDto,
  CreateRegisteredDto,
} from './tenant.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Roles } from 'src/login/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/login/guards/jwt-auth.guard';
import { RolesGuard } from 'src/login/guards/auth.guard';

@Controller('tenant')
@ApiTags('tenant')
export class TenantController {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    private readonly tenantService: TenantService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super admin')
  @Get()
  @getAllTenantsSwagger()
  async findAll(): Promise<{ message: string; data: Tenant[] }> {
    const tenants = await this.tenantRepository.find();
    return {
      message: 'Tenants retrieved successfully',
      data: tenants,
    };
  }

  @Get('email/filter')
  async filterByEmail(
    @Query('tenant_email') tenant_email: string,
  ): Promise<{ message: string; data?: Tenant }> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_email },
    });
    if (tenant) {
      return {
        message: 'Tenant retrieved successfully',
        data: tenant,
      };
    } else {
      return {
        message: 'Tenant with this email does not exist',
      };
    }
  }

  @Get(':id')
  @getAllTenantsSwagger()
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; data?: Tenant }> {
    const getTenantByIdDto = plainToClass(GetTenantByIdDto, { id });

    const errors = await validate(getTenantByIdDto);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }

    const tenant = await this.tenantRepository.findOne({
      where: { id: getTenantByIdDto.id },
    });
    if (tenant) {
      return {
        message: 'Tenant retrieved successfully',
        data: tenant,
      };
    } else {
      return {
        message: `Tenant with ID ${id} not found`,
      };
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super admin')
  @Post()
  @createTenantSwagger()
  async create(
    @Body() tenantData: Tenant,
  ): Promise<{ message: string; data?: Tenant }> {
    const createTenantDto = plainToClass(CreateTenantDto, tenantData);

    const errors = await validate(createTenantDto);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    tenantData.isRegistered = false
    const result = await this.tenantService.createTenant(tenantData);
    return result;
  }

  @Post('register')
  @createRegisterSwagger()
  async tenantRegister(
    @Body() tenantData: Tenant,
  ): Promise<{ message: string; data?: Tenant }> {
    const createTenantDto = plainToClass(CreateRegisteredDto, tenantData);

    const errors = await validate(createTenantDto);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    tenantData.isRegistered = true
    const result = await this.tenantService.createTenant(tenantData);
    return result;
  }



  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super admin')
  @Patch(':id')
  @updateTenantSwagger()
  async update(
    @Param('id') id: number,
    @Body() tenantData: Tenant,
  ): Promise<{ message: string; updatedData: Tenant }> {
    const updateTenantDto = plainToClass(UpdateTenantDto, tenantData);

    const errors = await validate(updateTenantDto);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    await this.tenantRepository.update(id, tenantData);
    const updatedTenant = await this.tenantRepository.findOne({
      where: { id },
    });
    return {
      message: 'Tenant updated successfully',
      updatedData: updatedTenant,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super admin')
  @Delete(':id')
  @deleteTenantSwagger()
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    const deleteTenantDto = plainToClass(DeleteTenantDto, { id });

    const errors = await validate(deleteTenantDto);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }

    await this.tenantRepository.delete(id);
    return { message: `Tenant with ID ${id} deleted successfully` };
  }
}

export default TenantController;
