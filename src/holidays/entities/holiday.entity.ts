import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

//current holidays
@Schema({ timestamps: true })
export class Holiday {
  @Prop({
    type: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CatalogueHoliday',
    },
  })
  id_holiday: string;

  @Prop({ required: true, unique: true })
  date: Date;

  @Prop({ required: true })
  id_tm: number;
}

export const HolidaySchema = SchemaFactory.createForClass(Holiday);

//holidays avaliables to select
@Schema({ timestamps: true })
export class CatalogueHoliday {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: 'mexico' })
  country?: string;

  @Prop({ required: true })
  id_tm: number;
}

export const CatalogueHolidaySchema =
  SchemaFactory.createForClass(CatalogueHoliday);
