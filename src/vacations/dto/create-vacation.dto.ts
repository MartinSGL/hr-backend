import { IsArray, IsOptional } from 'class-validator';

export class CreateVacationDto {
  @IsArray()
  @IsOptional()
  dates: Date[];

  @IsArray()
  @IsOptional()
  half_days?: Date[];

  @IsArray()
  @IsOptional()
  holidays?: Date[];
}
