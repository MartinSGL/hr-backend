import { IsEmail, IsEnum } from 'class-validator';
import {
  ProjectRole,
  project_role,
} from '../interfaces/project-role.interface';

export class CreatePreauthorizationDto {
  @IsEmail()
  email: string;

  @IsEnum(project_role)
  project_role: ProjectRole;
}
