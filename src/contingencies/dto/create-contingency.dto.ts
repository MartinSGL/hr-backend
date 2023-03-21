import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateContingencyDto {
  @IsDateString()
  date: Date;

  @IsOptional()
  @IsString()
  comments?: string;
}
