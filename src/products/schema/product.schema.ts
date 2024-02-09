import { Prop, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Product extends Document {
  @Prop({
    type: {
      ar: {
        type: String,
        required: [true, 'arabic name of product required'],
        minlength: [3, 'arabic name of product must be at least 3 characters'],
        maxlength: [
          100,
          'arabic name of product must be at most 100 characters',
        ],
      },
      en: {
        type: String,
        required: [true, 'english name of product required'],
        minlength: [3, 'english name of product must be at least 3 characters'],
        maxlength: [
          100,
          'english name of product must be at most 100 characters',
        ],
      },
      _id: false,
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
        required: [true, 'arabic description of product required'],
        minlength: [
          20,
          'arabic description of product must be at least 20 characters',
        ],
      },
      en: {
        type: String,
        required: [true, 'english description of product required'],
        minlength: [
          20,
          'english description of product must be at least 20 characters',
        ],
      },
      _id: false,
    },
  })
  description: {
    ar: string;
    en: string;
  };

  @Prop({
    type: {
      ar: {
        type: String,
      },
      en: {
        type: String,
      },
      _id: false,
    },
  })
  author: {
    ar: string;
    en: string;
  };

  @Prop({
    type: {
      ar: {
        type: String,
      },
      en: {
        type: String,
      },
      _id: false,
    },
  })
  details: {
    ar: string;
    en: string;
  };

  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({
    type: [
      {
        store: {
          type: Types.ObjectId,
          ref: 'Store',
          required: [true, 'Product must be belongs to store'],
        },
        price: {
          type: Number,
          required: [true, 'price required'],
        },
        priceAfterDiscount: {
          type: Number,
        },
        quantity: {
          type: Number,
          required: [true, 'Product quantity is required'],
        },
        sold: {
          type: Number,
          default: 0,
        },
        _id: false,
      },
    ],
  })
  stores: {
    store: Types.ObjectId;
    price: number;
    priceAfterDiscount: number;
    quantity: number;
    sold: number;
  }[];

  @Prop({
    type: Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product must be belongs to category'],
  })
  category: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  isArchive: boolean;
}