import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ProjectRole } from '../interfaces/project-role.interface';

@Schema({ timestamps: true })
export class Preauthorization {
  @Prop({ required: true, index: true })
  id_employee: number;

  @Prop({ require: true })
  name: string;

  @Prop({ require: true })
  email: string;

  @Prop({ require: true })
  project_role: ProjectRole;
}

export const PreauthorizationSchema =
  SchemaFactory.createForClass(Preauthorization);
PreauthorizationSchema.index({ id_employee: 1, email: 1 }, { unique: true });
