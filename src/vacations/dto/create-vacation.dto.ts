import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { status, Status } from 'src/common/interfaces/status.interface';

export class CreateVacationDto {
  @IsString()
  folio: string;

  @IsDateString()
  init_date: Date;

  @IsDateString()
  final_date: Date;

  @IsBoolean()
  @IsOptional()
  half_date?: Date[];

  @IsNotEmpty()
  client_evidence: string;

  @IsEnum(status)
  @IsOptional()
  status?: Status;

  @IsOptional()
  comments?: string;
}
