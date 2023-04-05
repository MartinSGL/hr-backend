import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import {
  ProjectRole,
  project_roles,
} from '../interfaces/project-role.interface';

@Schema({ timestamps: true })
export class Preauthorization {
  @Prop({ required: true, index: true })
  id_employee: string;

  @Prop({ require: true })
  name_responsible: string;

  @Prop({ require: true })
  email_responsible: string;

  @Prop({ require: true })
  project_role: ProjectRole;
}

export const PreauthorizationSchema =
  SchemaFactory.createForClass(Preauthorization);
PreauthorizationSchema.index(
  { id_employee: 1, email_responsible: 1 },
  { unique: true },
);
