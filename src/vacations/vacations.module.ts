import { Module } from '@nestjs/common';
import { VacationsService } from './vacations.service';
import { VacationsController } from './vacations.controller';

@Module({
  controllers: [VacationsController],
  providers: [VacationsService],
})
export class VacationsModule {}
