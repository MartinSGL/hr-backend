import { PartialType } from '@nestjs/mapped-types';
import { CreateContingencyDto } from './create-contingency.dto';

export class UpdateContingencyDto extends PartialType(CreateContingencyDto) {}
