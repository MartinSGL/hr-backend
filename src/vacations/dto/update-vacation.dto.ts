import { PartialType } from '@nestjs/mapped-types';
import { IsEnum } from 'class-validator';
import { status } from 'src/common/interfaces/status.interface';
import { CreateVacationDto } from './create-vacation.dto';

export class UpdateVacationDto extends PartialType(CreateVacationDto) {
  @IsEnum(status)
  status: string;
}
