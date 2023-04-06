import { IsOptional, IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { Status, status } from 'src/common/interfaces/status.interface';

export class UpdateStatusContingencyDto {
  @IsEnum(status)
  status: Status;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  observations?: string;
}
