import { Module } from '@nestjs/common';
import { ContingenciesService } from './contingencies.service';
import { ContingenciesController } from './contingencies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Contingency, ContingencySchema } from './entities/contingency.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [ContingenciesController],
  providers: [ContingenciesService],
  imports: [
    CommonModule,
    MongooseModule.forFeature([
      {
        name: Contingency.name,
        schema: ContingencySchema,
      },
    ]),
  ],
})
export class ContingenciesModule {}
