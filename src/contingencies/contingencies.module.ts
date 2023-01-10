import { Module } from '@nestjs/common';
import { ContingenciesService } from './contingencies.service';
import { ContingenciesController } from './contingencies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Contingency, ContingencySchema } from './entities/contingency.entity';

@Module({
  controllers: [ContingenciesController],
  providers: [ContingenciesService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Contingency.name,
        schema: ContingencySchema,
      },
    ]),
  ],
})
export class ContingenciesModule {}
