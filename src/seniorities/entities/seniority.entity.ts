import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Seniority {
  @Prop({ required: true })
  seniority: string;

  @Prop({ required: true })
  days_by_law: number;

  @Prop({ required: true })
  days_by_improving: number;
}

export const SenioritySchema = SchemaFactory.createForClass(Seniority);
