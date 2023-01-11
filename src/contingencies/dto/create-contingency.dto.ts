import { IsBoolean, IsDateString, IsOptional } from 'class-validator';

export class CreateContingencyDto {
  @IsDateString()
  date: Date;

  @IsBoolean()
  @IsOptional()
  half_date?: boolean;

  @IsOptional()
  comments?: string;
}
