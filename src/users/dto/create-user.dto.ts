import { IsEmail, IsEnum } from 'class-validator';
import { SuperRoles, superRoles } from '../interfaces';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsEnum(superRoles)
  role: SuperRoles;
}
