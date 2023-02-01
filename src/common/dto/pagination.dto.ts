import { IsNumber, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDto {
  //transform the data
  @Transform(({ value }) => +value)
  @IsNumber()
  @IsPositive()
  page: number;
}
