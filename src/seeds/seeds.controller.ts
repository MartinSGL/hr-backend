import { Controller, Get } from '@nestjs/common';
import { SeedsService } from './seeds.service';

@Controller('seed')
export class SeedsController {
  constructor(private readonly seedsService: SeedsService) {}

  @Get('/admin-info')
  setAdminInfo() {
    return this.seedsService.setAdminInfo();
  }
}
