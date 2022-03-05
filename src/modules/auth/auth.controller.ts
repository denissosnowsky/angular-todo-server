import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Res,
  Request,
} from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';

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
  async activateAccount(
    @Param('link') link: string,
    @Res() response: Response,
  ) {
    this.authService.activateAccount(link);
    response.sendFile(path.join(__dirname, '../../../../src/html/link.html'));
  }

  @Post('sendEmail')
  async sendEmail(@Body() body: { link: string; email: string }) {
    return this.authService.sendEmail(body.link, body.email);
  }

  @Post('sendReset')
  async sendReset(@Body() body: { email: string }) {
    return this.authService.sendReset(body.email);
  }
}
