import { IsNotEmpty, IsDateString } from 'class-validator';

export class CreateHolidayDto {
  @IsNotEmpty()
  name: string;

  @IsDateString()
  date: Date;
}
