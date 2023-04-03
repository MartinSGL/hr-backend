import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Status, status } from 'src/common/interfaces/status.interface';
import * as paginate from 'mongoose-paginate-v2';
import {
  ProjectResponsibles,
  ProjectResponsiblesSchema,
} from 'src/common/entities/project-responsibles.entity';

@Schema({ timestamps: true })
export class Contingency {
  @Prop({ required: true, unique: true })
  folio: string;

  @Prop({ required: true, index: true })
  id_employee: string;

  @Prop({ required: true })
  name_employee: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ default: 'pending', enum: status, index: true })
  status?: Status;

  @Prop({ default: '' })
  comments?: string;

  @Prop({ default: '' })
  observations?: string;

  @Prop({ type: [ProjectResponsiblesSchema], required: true })
  project_responsibles: ProjectResponsibles[];

  @Prop({ default: '0' })
  id_tm?: string;

  @Prop({ required: true })
  createdBy: string;
}

export interface ContingencyDocument extends Contingency, Document {}
export const ContingencySchema = SchemaFactory.createForClass(Contingency);
ContingencySchema.plugin(paginate);
