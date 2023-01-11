import { Prop, Schema } from '@nestjs/mongoose';
import { status, Status } from 'src/common/interfaces/status.interface';

@Schema({ timestamps: true })
export class Vacation {
  @Prop({ required: true, unique: true })
  folio: string;

  @Prop({ required: true })
  id_employee: number;

  @Prop({ required: true })
  init_date: Date;

  @Prop({ required: true })
  final_date: Date;

  @Prop([Date])
  half_date?: Date[];

  @Prop({ required: true })
  client_evidence: string;

  @Prop({ default: 'pending', enum: status, index: true })
  status?: Status;

  @Prop({ default: '' })
  comments?: string;

  @Prop({ required: true })
  id_tm: number;
}
