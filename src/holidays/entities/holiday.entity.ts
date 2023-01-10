import { Schema, Prop } from '@nestjs/mongoose';
@Schema({ timestamps: true })
export class Holiday {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  date: Date;

  @Prop({ default: 'no image' })
  image: string;

  @Prop({ required: true })
  id_tm: number;
}
