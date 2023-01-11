import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateVacationDto {
  @IsDateString()
  init_date: Date;

  @IsDateString()
  final_date: Date;

  @IsBoolean()
  @IsOptional()
  half_date?: Date[];

  @IsNotEmpty()
  @IsString()
  client_evidence: string;

  @IsOptional()
  comments?: string;
}
