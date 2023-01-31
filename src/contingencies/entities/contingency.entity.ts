import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Status, status } from 'src/common/interfaces/status.interface';
import * as paginate from 'mongoose-paginate-v2';

@Schema({ timestamps: true })
export class Contingency {
  @Prop({ required: true, unique: true })
  folio: string;

  @Prop({ required: true, index: true })
  id_employee: number;

  @Prop({ required: true })
  name_employee: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ default: false })
  half_day?: boolean;

  @Prop({ default: 'pending', enum: status, index: true })
  status?: Status;

  @Prop({ default: '' })
  comments?: string;

  @Prop({ default: '' })
  observations?: string;

  @Prop({ required: true, default: 0 })
  id_tm?: number;
}

export interface ContingencyDocument extends Contingency, Document {}
export const ContingencySchema = SchemaFactory.createForClass(Contingency);
ContingencySchema.plugin(paginate);
