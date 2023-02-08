import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateContingencyDto {
  @IsDateString()
  date: Date;

  @IsBoolean()
  @IsOptional()
  half_day?: boolean;

  @IsOptional()
  @IsString()
  comments?: string;
}
