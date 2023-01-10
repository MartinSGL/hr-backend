import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Status, status } from 'src/common/interfaces/status.interface';

@Schema()
export class Contingency {
  @Prop({ required: true, unique: true })
  folio: string;

  @Prop({ required: true, index: true })
  id_employee: number;

  @Prop({ required: true })
  date: Date;

  @Prop({ default: false })
  half_date?: boolean;

  @Prop({ default: 'pending', enum: status, index: true })
  status?: Status;

  @Prop({ default: 'no comments' })
  comments?: string;
}

export const ContingencySchema = SchemaFactory.createForClass(Contingency);
