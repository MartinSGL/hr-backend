import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

const status = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
  canceled: 'canceled',
};

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

  @Prop({ index: true, default: 'pending', enum: status })
  status?: 'pending' | 'approved' | 'rejected' | 'canceled';

  @Prop({ default: 'no comments' })
  comments?: string;
}

export const ContingencySchema = SchemaFactory.createForClass(Contingency);
