import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectResponsableDto } from './create-project-responsable.dto';

export class UpdateProjectResponsableDto extends PartialType(
  CreateProjectResponsableDto,
) {}
