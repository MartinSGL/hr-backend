import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Status, status } from 'src/common/interfaces/status.interface';

@Schema({ timestamps: true })
export class Contingency {
  @Prop({ required: true, unique: true })
  folio: string;

  @Prop({ required: true, index: true })
  id_employee: number;

  @Prop({ required: true })
  date: Date;

  @Prop({ default: false })
  half_day?: boolean;

  @Prop({ default: 'pending', enum: status, index: true })
  status?: Status;

  @Prop({ default: '' })
  reason?: string;

  @Prop({ default: '' })
  comments?: string;

  @Prop({ required: true })
  id_tm: number;
}

export const ContingencySchema = SchemaFactory.createForClass(Contingency);
