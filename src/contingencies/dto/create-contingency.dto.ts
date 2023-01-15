import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateContingencyDto {
  @IsDateString()
  date: Date;

  @IsBoolean()
  @IsOptional()
  half_date?: boolean;

  @IsOptional()
  @IsString()
  comments?: string;
}
