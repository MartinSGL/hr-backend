import { Transform, TransformFnParams } from 'class-transformer';
import { IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { Status, status } from 'src/common/interfaces/status.interface';

export class UpdateStatusContingencyDto {
  @IsEnum(status)
  status: Status;

  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  observations?: string;
}
