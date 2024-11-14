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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import {
  createProjectSwagger,
  //   competencyNameSwagger,
  getAllProjectsSwagger,
  getProjectByIdSwagger,
  updateProjectSwagger,
  deleteProjectSwagger,
} from './project.swagger';
import {
  CreateProjectDto,
  ProjectNameDto,
  UpdateProjectDto,
  ProjectIdDto,
} from './project.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { JwtAuthGuard } from 'src/login/guards/jwt-auth.guard';
import { RolesGuard } from 'src/login/guards/auth.guard';
import { Roles } from 'src/login/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { connect } from 'net';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'employee')
  @Post()
  @createProjectSwagger()
  @UseInterceptors(FileInterceptor('file'))
  async createProject(@Request() req, @Body() userData: CreateProjectDto, @UploadedFile() file: Express.Multer.File) {
    const tenantCode = req.headers.tenant_code;
    const projectData = plainToClass(CreateProjectDto, userData);
    const errors = await validate(projectData);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.projectService.createProject(tenantCode, userData, file);
  
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin' , 'employee')
  @Get()
  @getAllProjectsSwagger()
  async getAllProjects(@Request() req) {
    const tenantCode = req.headers.tenant_code;
    return await this.projectService.getAllProjects(tenantCode);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin' , 'employee')
  @Get(':id')
  @getProjectByIdSwagger()
  async getProjectById(@Param('id') id: string, @Request() req) {
    const tenantCode = req.headers.tenant_code;
    const competencyIdDto = plainToClass(ProjectIdDto, { id });
    const errors = await validate(ProjectIdDto);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.projectService.getProjectById(id, tenantCode);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'employee')
  @Put(':id')
  @updateProjectSwagger()
  @UseInterceptors(FileInterceptor('file'))
  async updateCompetency(
    @Param('id') id: string,
    @Body() projectData: UpdateProjectDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    const tenantCode = req.headers.tenant_code;
    const competencyData = plainToClass(UpdateProjectDto, projectData);
    const errors = await validate(competencyData);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
  
    return await this.projectService.updateProject(id, tenantCode, projectData, file);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'employee')
  @Delete(':id')
  @deleteProjectSwagger()
  async deleteCompetency(@Param('id') id: string, @Request() req) {
    const tenantCode = req.headers.tenant_code;
    const competencyIdDto = plainToClass(ProjectIdDto, { id });
    const errors = await validate(ProjectIdDto);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.projectService.deleteProject(id, tenantCode);
  }
}
