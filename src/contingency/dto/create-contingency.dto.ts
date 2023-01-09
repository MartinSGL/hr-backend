import { IsBoolean, IsDateString, IsEnum, IsOptional } from 'class-validator';

const status = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
  canceled: 'canceled',
};

export class CreateContingencyDto {
  @IsDateString()
  date: Date;

  @IsBoolean()
  @IsOptional()
  half_date?: boolean;

  @IsEnum(status)
  @IsOptional()
  status?: 'pending' | 'approved' | 'rejected' | 'canceled';

  @IsOptional()
  comments?: string;
}
