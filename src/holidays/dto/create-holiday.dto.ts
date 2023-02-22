import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsDateString } from 'class-validator';
import { Types } from 'mongoose';
import { ParseMongoIdPipe } from 'src/common/pipe/parse-mongo-id.pipe';

export class CreateHolidayDto {
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  @Transform(() => ParseMongoIdPipe)
  id_holiday: Types.ObjectId;

  @IsDateString()
  date: Date;
}
