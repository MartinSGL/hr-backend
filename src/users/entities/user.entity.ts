import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SuperRoles, superRoles } from '../interfaces';
//this entity is for talent manager users
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, enum: superRoles })
  role: SuperRoles;

  @Prop({ required: true })
  id_tm: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
