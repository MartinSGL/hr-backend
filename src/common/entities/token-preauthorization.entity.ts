import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class TokenPreauthorization {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  id_request: Types.ObjectId;

  @Prop({ required: true })
  token: string;

  @Prop({ default: Date.now, expires: 604800 })
  expiresAt?: Date;
}

export const TokenPreauthorizationSchema = SchemaFactory.createForClass(
  TokenPreauthorization,
);
