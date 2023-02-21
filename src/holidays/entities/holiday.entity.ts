import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

//current holidays
@Schema({ timestamps: true })
export class Holiday {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  date: Date;

  @Prop({ default: 'mexico' })
  country?: string;

  @Prop({ required: true })
  id_tm: number;
}

export const HolidaySchema = SchemaFactory.createForClass(Holiday);

//holidays avaliables to select
@Schema({ timestamps: true })
export class HolidayCatalogue {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: 'mexico' })
  country?: string;

  @Prop({ required: true })
  id_tm: number;
}

export const HolidayCatalogueSchema =
  SchemaFactory.createForClass(HolidayCatalogue);
