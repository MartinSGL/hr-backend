import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import {
  ProjectRole,
  project_roles,
} from 'src/project-responsables/interfaces/project-role.interface';
import {
  StatusPreauthorization,
  statusPreauthorizaton,
} from '../interfaces/status.interface';

@Schema({ _id: false })
export class ProjectResponsibles {
  @Prop({ require: true })
  name: string;

  @Prop({ require: true })
  email: string;

  @Prop({ require: true, enum: project_roles })
  project_role: ProjectRole;

  @Prop({ default: 'pending', enum: statusPreauthorizaton })
  preauthorize?: StatusPreauthorization;

  @Prop({ default: '' })
  observations?: string;
}

export const ProjectResponsiblesSchema =
  SchemaFactory.createForClass(ProjectResponsibles);
