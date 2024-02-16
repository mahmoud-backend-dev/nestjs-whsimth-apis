import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Category extends Document {
  @Prop({
    type: {
      ar: {
        type: String,
        required: [true, 'Arabic name of category required'],
        minlength: [3, 'Too short category name'],
        maxlength: [32, 'Too long category name'],
      },
      en: {
        type: String,
        required: [true, 'English name of category required'],
        minlength: [3, 'Too short category name'],
        maxlength: [32, 'Too long category name'],
      },
      _id: false,
    },
  })
  name: string;

  @Prop({ type: Boolean, default: false })
  isArchive: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
