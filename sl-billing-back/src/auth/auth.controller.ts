import { Body, Controller, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dtos/login-auth.dto';
import { ChangePasswordAuthDto } from './dtos/change-password-auth.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetUser } from '../decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginAuth: LoginAuthDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.login(loginAuth);
  }

  @Post('forget-password')
  async forgetPassword(@Query('email') email: string): Promise<void> {
    return await this.authService.forgetPassword(email);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @GetUser() id: string,
    @Body() changePasswordDto: ChangePasswordAuthDto,
    @Req() req,
  ): Promise<void> {
    return await this.authService.changePassword(id, changePasswordDto, req);
  }
}
