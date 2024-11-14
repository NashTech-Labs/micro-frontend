import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Request,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { CompetencyService } from './competency.service';
import {
  createCompetencySwagger,
  competencyNameSwagger,
  getAllCompetenciesSwagger,
  getCompetencyByIdSwagger,
  updateCompetencySwagger,
  deleteCompetencySwagger,
} from './competency.swagger';
import {
  CreateCompetencyDto,
  CompetencyNameDto,
  UpdateCompetencyDto,
  CompetencyIdDto,
} from './competency.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { JwtAuthGuard } from 'src/login/guards/jwt-auth.guard';
import { RolesGuard } from 'src/login/guards/auth.guard';
import { Roles } from 'src/login/decorators/roles.decorator';

@Controller('competency')
export class CompetencyController {
  constructor(private readonly competencyService: CompetencyService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'employee')
  @Post()
  @createCompetencySwagger()
  async createCompetency(
    @Request() req,
    @Body() userData: CreateCompetencyDto,
  ) {
    const tenantCode = req.headers.tenant_code;
    const competencyData = plainToClass(CreateCompetencyDto, userData);
    const errors = await validate(competencyData);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.competencyService.createCompetency(tenantCode, userData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'employee')
  @Post('competencyName')
  @competencyNameSwagger()
  async competencyName(@Request() req, @Body() data: CompetencyNameDto) {
    const tenantCode = req.headers.tenant_code;
    const competencyData = plainToClass(CompetencyNameDto, data);
    const errors = await validate(competencyData);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.competencyService.competencyName(tenantCode, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'employee')
  @Get()
  @getAllCompetenciesSwagger()
  async getAllCompetencies(@Request() req) {
    const tenantCode = req.headers.tenant_code;
    return await this.competencyService.getAllCompetencies(tenantCode);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'employee')
  @Get(':id')
  @getCompetencyByIdSwagger()
  async getCompetencyById(@Param('id') id: string, @Request() req) {
    const tenantCode = req.headers.tenant_code;
    const competencyIdDto = plainToClass(CompetencyIdDto, { id });
    const errors = await validate(competencyIdDto);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.competencyService.getCompetencyById(id, tenantCode);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'employee')
  @Put(':id')
  @updateCompetencySwagger()
  async updateCompetency(
    @Param('id') id: string,
    @Body() compentencyData: UpdateCompetencyDto,
    @Request() req,
  ) {
    const tenantCode = req.headers.tenant_code;
    const competencyData = plainToClass(UpdateCompetencyDto, compentencyData);
    const errors = await validate(competencyData);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.competencyService.updateCompetency(
      id,
      tenantCode,
      compentencyData,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'employee')
  @Delete(':id')
  @deleteCompetencySwagger()
  async deleteCompetency(@Param('id') id: string, @Request() req) {
    const tenantCode = req.headers.tenant_code;
    const competencyIdDto = plainToClass(CompetencyIdDto, { id });
    const errors = await validate(competencyIdDto);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.competencyService.deleteCompetency(id, tenantCode);
  }
}
