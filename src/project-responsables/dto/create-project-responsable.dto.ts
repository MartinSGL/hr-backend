import { IsEmail, IsEnum } from 'class-validator';
import {
  ProjectRole,
  project_roles,
} from 'src/project-responsables/interfaces/project-role.interface';

export class CreateProjectResponsableDto {
  @IsEmail()
  email_responsible: string;

  @IsEnum(project_roles)
  project_role: ProjectRole;
}
