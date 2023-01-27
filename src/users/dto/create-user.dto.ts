import { IsEmail, IsEnum } from 'class-validator';
import { SuperRoles } from '../interfaces';
import { superRoles } from '../interfaces/rolesInterface';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsEnum(superRoles)
  role: SuperRoles;
}
