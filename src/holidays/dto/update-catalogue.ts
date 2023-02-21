import { PartialType } from '@nestjs/mapped-types';
import { CreateCatalogueDto } from './create-catalogue';

export class UpdateCatalogueDto extends PartialType(CreateCatalogueDto) {}
