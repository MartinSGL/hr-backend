import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ProjectRole } from 'src/project-responsables/interfaces/project-role.interface';
import { project_roles } from '../interfaces/project-role.interface';

@Schema({ timestamps: true })
export class ProjectResponsable {
  @Prop({ required: true, index: true })
  id_employee: string;

  @Prop({ require: true })
  name_responsible: string;

  @Prop({ require: true })
  email_responsible: string;

  @Prop({ require: true, enum: project_roles })
  project_role: ProjectRole;
}

export const ProjectResponsableSchema =
  SchemaFactory.createForClass(ProjectResponsable);
ProjectResponsableSchema.index(
  { id_employee: 1, email_responsible: 1 },
  { unique: true },
);
