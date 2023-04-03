import { Module } from '@nestjs/common';
import { ContingenciesService } from './contingencies.service';
import { ContingenciesController } from './contingencies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Contingency, ContingencySchema } from './entities/contingency.entity';
import { CommonModule } from 'src/common/common.module';
import { UsersModule } from 'src/users/users.module';
import { ContingenciesControllerTM } from './contingencies-tm.controller';
import { PreauthorizationsModule } from '../preauthorizations/preauthorizations.module';

@Module({
  controllers: [ContingenciesController, ContingenciesControllerTM],
  providers: [ContingenciesService],
  imports: [
    CommonModule,
    MongooseModule.forFeature([
      {
        name: Contingency.name,
        schema: ContingencySchema,
      },
    ]),
    UsersModule,
    PreauthorizationsModule,
  ],
})
export class ContingenciesModule {}
