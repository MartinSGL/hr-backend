import { Controller, Get } from '@nestjs/common';
import { SenioritiesService } from './seniorities.service';

@Controller('seniorities')
export class SenioritiesController {
  constructor(private readonly senioritiesService: SenioritiesService) {}

  @Get()
  findAll() {
    return this.senioritiesService.findAll();
  }
}
