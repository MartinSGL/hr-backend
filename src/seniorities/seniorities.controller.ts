import { Controller, Get } from '@nestjs/common';
import { Auth } from 'src/users/decorator';
import { SenioritiesService } from './seniorities.service';

@Controller('seniorities')
@Auth()
export class SenioritiesController {
  constructor(private readonly senioritiesService: SenioritiesService) {}

  @Get()
  findAll() {
    return this.senioritiesService.findAll();
  }
}
