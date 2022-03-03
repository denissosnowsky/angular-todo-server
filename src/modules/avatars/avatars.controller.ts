import { Controller, Get, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AvatarTable } from 'src/types/tables/avatar.table';
import { AvatarsService } from './avatars.service';
import { Avatar } from './schemas/avatars.schema';

@Controller('avatars')
export class AvatarsController {
  constructor(private readonly avatarsService: AvatarsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAvatars(): Promise<AvatarTable[]> {
    return this.avatarsService.getAvatars();
  }
}
