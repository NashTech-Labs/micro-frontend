import { Controller, Post, Body } from '@nestjs/common';
import { LoginService } from './login.service';

interface LoginBody {
  email: string;
  password: string;
  role: string;
  tenant_code?: string;
}

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  async login(@Body() body: LoginBody) {
    return this.loginService.login(body);
  }
}
