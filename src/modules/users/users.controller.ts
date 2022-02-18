import {
  Body,
  Controller,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
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
  uploadPhoto(@Body() photoBody: { photoName: string }, @Request() req): void {
    this.usersService.uploadPhoto(req.user.id, photoBody.photoName);
  }
}
