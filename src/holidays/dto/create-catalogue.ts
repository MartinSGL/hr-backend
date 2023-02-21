import { IsNotEmpty } from 'class-validator';

export class CreateCatalogueDto {
  @IsNotEmpty()
  name: string;
}
