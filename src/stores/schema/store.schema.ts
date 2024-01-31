import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Store extends Document {
  @Prop({
    type:{
      ar: {
        type: String,
        required: [true, 'arabic name required'],
        minlength: [3, 'arabic name must be at least 3 characters'],
      },
      en: {
        type: String,
        required: [true, 'english name required'],
        minlength: [3, 'english name must be at least 3 characters'],
      },
    },
  })
  name: {
    ar: string;
    en: string;
  };

  @Prop({
    type: {
      ar: {
        type: String,
        required: [true, 'arabic region required'],
      },
      en: {
        type: String,
        required: [true, 'english region required'],
      },
    },
  })
  region: {
    ar: string;
    en: string;
  };

  @Prop({
    type: {
      ar: {
        type: String,
        required: [true, 'arabic city required'],
      },
      en: {
        type: String,
        required: [true, 'english city required'],
      },
    }
  })
  city: {
    ar: string;
    en: string;
  };

  @Prop({ type: String })
  image: string;

  @Prop({ type: Boolean, default: false })
  isArchive: boolean;
};

export const StoreSchema = SchemaFactory.createForClass(Store);