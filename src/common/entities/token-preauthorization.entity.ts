import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class TokenPreauthorization {
  @Prop({ required: true })
  token: string;

  @Prop({ default: Date.now, expires: 604800 })
  expiresAt?: Date;
}

export const TokenPreauthorizationSchema = SchemaFactory.createForClass(
  TokenPreauthorization,
);
