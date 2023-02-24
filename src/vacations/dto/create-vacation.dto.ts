import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVacationDto {
  @IsArray()
  dates: Date[];

  @IsArray()
  @IsOptional()
  half_days?: Date[];

  @IsNotEmpty()
  @IsString()
  client_evidence: string;
}
