import { PartialType } from '@nestjs/mapped-types';
import { IsEnum } from 'class-validator';
import { Status, status } from 'src/common/interfaces/status.interface';
import { CreateContingencyDto } from './create-contingency.dto';

export class UpdateContingencyDto extends PartialType(CreateContingencyDto) {
  @IsEnum(status)
  status: Status;
}
