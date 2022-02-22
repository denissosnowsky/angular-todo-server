import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateUserDAO } from 'src/types/dao/create-user.dao';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signin')
  async login(@Body() body: { email: string; password: string }) {
    return await this.authService.login(body);
  }

  @Post('signup')
  async register(@Body() body: CreateUserDAO) {
    return this.authService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify')
  async verify(@Request() req) {
    return this.authService.verify(req.user);
  }

  @Get('activate/:link')
  async activateAccount(@Param('link') link: string) {
    return this.authService.activateAccount(link);
  }

  @Post('sendEmail')
  async sendEmail(@Body() body: { link: string; email: string }) {
    return this.authService.sendEmail(body.link, body.email);
  }
}
