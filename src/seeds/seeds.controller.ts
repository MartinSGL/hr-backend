import { Controller, Get, Param } from '@nestjs/common';
import { SeedsService } from './seeds.service';

@Controller('seeds')
export class SeedsController {
  constructor(private readonly seedsService: SeedsService) {}

  @Get('/:password')
  executeSeeders(@Param('password') password: string) {
    return this.seedsService.executeSeeders(password);
  }
}
