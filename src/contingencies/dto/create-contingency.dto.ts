import { IsBoolean, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { status, Status } from 'src/common/interfaces/status.interface';

export class CreateContingencyDto {
  @IsDateString()
  date: Date;

  @IsBoolean()
  @IsOptional()
  half_date?: boolean;

  @IsEnum(status)
  @IsOptional()
  status?: Status;

  @IsOptional()
  comments?: string;
}
