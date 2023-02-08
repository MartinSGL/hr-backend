import { IsNumber, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDto {
  //transform page from string to a number
  @Transform(({ value }) => +value)
  //validate data
  @IsNumber()
  @IsPositive()
  page: number;
}
