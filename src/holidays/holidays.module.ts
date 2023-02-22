import { Module } from '@nestjs/common';
import { HolidaysService } from './holidays.service';
import { HolidaysController } from './holidays.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CatalogueHoliday,
  CatalogueHolidaySchema,
} from './entities/holiday.entity';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [HolidaysController],
  providers: [HolidaysService],
  imports: [
    CommonModule,
    MongooseModule.forFeature([
      {
        name: CatalogueHoliday.name,
        schema: CatalogueHolidaySchema,
      },
    ]),
    UsersModule,
  ],
  exports: [HolidaysService],
})
export class HolidaysModule {}
