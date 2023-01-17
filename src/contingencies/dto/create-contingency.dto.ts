import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateContingencyDto {
  @IsDateString()
  date: Date;

  @IsBoolean()
  @IsOptional()
  half_day?: boolean;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  comments?: string;
}
