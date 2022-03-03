import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AvatarTable } from 'src/types/tables/avatar.table';

import { AvatarsRepository } from './avatars.repository';

@Injectable()
export class AvatarsService {
  private readonly logger = new Logger(AvatarsService.name);

  constructor(private avatarsRepository: AvatarsRepository) {}

  async getAvatars(): Promise<AvatarTable[]> {
    this.logger.log('avatars fetching...');
    try {
      return this.avatarsRepository.getAvatars();
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
