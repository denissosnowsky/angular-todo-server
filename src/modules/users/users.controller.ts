import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Put('/name')
  changeName(
    @Body() nameBody: { name: string },
    @Request() req,
  ): Promise<string> {
    return this.usersService.changeName(req.user.id, nameBody.name);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/photo')
  async uploadPhoto(
    @Body() photoBody: { photoName: string },
    @Request() req,
  ): Promise<void> {
    return this.usersService.uploadPhoto(req.user.id, photoBody.photoName);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/pass')
  async changePassword(
    @Body() nameBody: { oldPass: string; newPass: string },
    @Request() req,
  ): Promise<void> {
    return this.usersService.changePassword(
      req.user.email,
      nameBody.oldPass,
      nameBody.newPass,
    );
  }

  @Get('passConfirm/:link')
  async passConfirm(@Param('link') link: string, @Res() response: Response) {
    await this.usersService.confirmNewPassword(link);
    response.sendFile(path.join(__dirname, './html/password.html'));
  }

  @UseGuards(JwtAuthGuard)
  @Put('/email')
  changeEmail(
    @Body() nameBody: { email: string },
    @Request() req,
  ): Promise<void> {
    return this.usersService.changeEmail(req.user.email, nameBody.email);
  }
}
