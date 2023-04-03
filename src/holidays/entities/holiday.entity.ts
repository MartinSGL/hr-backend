import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

//current holidays
@Schema({ timestamps: true })
export class Holiday {
  @Prop({ required: true, unique: true })
  date: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Person' })
  id_holiday: string;

  @Prop({ required: true })
  id_tm: string;
}

export const HolidaySchema = SchemaFactory.createForClass(Holiday);

//holidays avaliables to select
@Schema({ timestamps: true })
export class CatalogueHoliday {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: 'mexico' })
  country?: string;

  @Prop({ default: true })
  isActive?: boolean;

  @Prop({ required: true })
  id_tm: string;
}

export const CatalogueHolidaySchema =
  SchemaFactory.createForClass(CatalogueHoliday);
