import { PartialType } from '@nestjs/mapped-types';
import { CreatePreauthorizationDto } from './create-preauthorization.dto';

export class UpdatePreauthorizationDto extends PartialType(
  CreatePreauthorizationDto,
) {}
