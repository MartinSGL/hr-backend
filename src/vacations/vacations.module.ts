import { Module } from '@nestjs/common';
import { VacationsService } from './vacations.service';
import { VacationsController } from './vacations.controller';
import { CommonModule } from 'src/common/common.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Vacation, VacationSchema } from './entities/vacation.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [VacationsController],
  providers: [VacationsService],
  imports: [
    CommonModule,
    MongooseModule.forFeature([
      {
        name: Vacation.name,
        schema: VacationSchema,
      },
    ]),
    UsersModule,
  ],
})
export class VacationsModule {}
