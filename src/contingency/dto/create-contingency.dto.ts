import { IsBoolean, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { RowStatus } from 'src/common/interfaces/status.interface';

export class CreateContingencyDto {
  @IsDateString()
  date: Date;

  @IsBoolean()
  @IsOptional()
  half_date?: boolean;

  @IsEnum(RowStatus)
  @IsOptional()
  status?: RowStatus;

  @IsOptional()
  comments?: string;
}
