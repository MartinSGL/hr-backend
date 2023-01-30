import { IsEmail, IsEnum } from 'class-validator';
import { superRoles, SuperRoles } from '../interfaces/rolesInterface';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsEnum(superRoles)
  role: SuperRoles;
}
