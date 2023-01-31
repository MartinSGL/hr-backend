import { Module } from '@nestjs/common';
import { SenioritiesService } from './seniorities.service';
import { SenioritiesController } from './seniorities.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Seniority, SenioritySchema } from './entities/seniority.entity';

@Module({
  controllers: [SenioritiesController],
  providers: [SenioritiesService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Seniority.name,
        schema: SenioritySchema,
      },
    ]),
  ],
  exports: [SenioritiesService],
})
export class SenioritiesModule {}
