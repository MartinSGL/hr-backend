import { Module } from '@nestjs/common';
import { ContingencyService } from './contingency.service';
import { ContingencyController } from './contingency.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Contingency, ContingencySchema } from './entities/contingency.entity';

@Module({
  controllers: [ContingencyController],
  providers: [ContingencyService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Contingency.name,
        schema: ContingencySchema,
      },
    ]),
  ],
})
export class ContingencyModule {}
