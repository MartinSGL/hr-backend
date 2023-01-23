import { IsEmail, IsEnum } from 'class-validator';
import { Roles, roles } from '../users.interface';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsEnum(roles)
  role: Roles;
}
