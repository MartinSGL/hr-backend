import { IsEmail, IsEnum } from 'class-validator';
import {
  ProjectRole,
  project_roles,
} from '../interfaces/project-role.interface';

export class CreatePreauthorizationDto {
  @IsEmail()
  email_responsible: string;

  @IsEnum(project_roles)
  project_role: ProjectRole;
}
