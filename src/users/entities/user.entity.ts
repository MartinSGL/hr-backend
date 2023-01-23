import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Roles, roles } from '../users.interface';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, enum: roles })
  role: Roles;

  @Prop({ required: true })
  id_tm: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
