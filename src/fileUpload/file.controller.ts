// files.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Request,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import csvParser from 'csv-parser';
import { multerConfig } from './multer.config';
import { UserService } from './../user/user.service';
import { Tenant } from '../tenant/tenant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { fileService } from './file.services';
import { JwtAuthGuard } from 'src/login/guards/jwt-auth.guard';
import { RolesGuard } from 'src/login/guards/auth.guard';
import { Roles } from 'src/login/decorators/roles.decorator';

@Controller('files')
export class FilesController {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    private readonly fileService: fileService,


  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'employee')
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadFile(@Request() req, @UploadedFile() file) {
    const tenantCode = req.headers.tenant_code; 

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const results = [];

    const readStream = fs.createReadStream(file.path);
    const parseStream = readStream.pipe(csvParser());

    try {
      for await (const data of parseStream) {
        results.push(data);
      }

      let final = await this.fileService.uplaodFile(tenantCode, results)
      if(final.length>0){
        fs.unlinkSync(file.path);
        return { messgae: 'Employees has been updated successfully', data: final };
      }

         
    } catch (error) {
      fs.unlinkSync(file.path); // delete the uploaded file on error
      throw new BadRequestException(
        `Failed to parse csv or upload data in database, ${error.message}`,
      );
    }
  }
}
