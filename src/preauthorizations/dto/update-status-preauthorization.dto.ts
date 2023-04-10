import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  StatusPreauthorization,
  statusPreauthorizaton,
} from 'src/common/interfaces/status.interface';
import {
  RequestType,
  request_type,
} from 'src/common/interfaces/type-request.interface';

export class UpdateStatusPreauthorizationDto {
  @IsEmail()
  email: string;

  @IsEnum(statusPreauthorizaton)
  status: StatusPreauthorization;

  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  observations?: string;

  @IsEnum(request_type)
  requestType: RequestType;

  @IsString()
  @IsNotEmpty()
  token: string;
}
