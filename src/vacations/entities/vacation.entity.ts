import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as paginate from 'mongoose-paginate-v2';
import { status, Status } from 'src/common/interfaces/status.interface';

@Schema({ timestamps: true })
export class Vacation {
  @Prop({ required: true, unique: true })
  folio: string;

  @Prop({ required: true })
  id_employee: number;

  @Prop({ required: true })
  name_employee: string;

  @Prop({ required: true })
  days: Date[];

  @Prop({ default: [] })
  half_days?: Date[];

  @Prop({ required: true })
  client_evidence: string;

  @Prop({ default: 'pending', enum: status, index: true })
  status?: Status;

  @Prop({ default: '' })
  observations?: string;

  @Prop({ required: true, default: 0 })
  id_tm?: number;

  @Prop({ required: true })
  createdBy: number;
}

export interface VacationDocument extends Vacation, Document {}
export const VacationSchema = SchemaFactory.createForClass(Vacation);
VacationSchema.plugin(paginate);
