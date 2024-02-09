import { Prop, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from 'src/products/schema/product.schema';
import { Store } from 'src/stores/schema/store.schema';
import { User } from 'src/users/schema/users.schema';

export enum OrderStatus {
  PENDING = 'Pending',
  PROCESSED = 'Processed',
  DELIVERED = 'Delivered',
  UNDELIVERED = 'Undelivered',
  CANCELED = 'Canceled',
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Order extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: [true, 'user is required'],
  })
  user: User;

  @Prop({
    type: [
      {
        _id: false,
        product: {
          type: Types.ObjectId,
          required: [true, 'product required'],
          ref: Product.name,
        },
        name: { type: { ar: String, en: String }, _id: false },
        description: { type: { ar: String, en: String }, _id: false },
        author: { type: { ar: String, en: String }, _id: false },
        details: { type: { ar: String, en: String }, _id: false },
        images: [String],
        quantity: { type: Number },
        priceAfterDiscount: { type: Number },
        price: { type: Number },
      },
    ],
  })
  cartItems: {
    product: Product;
    name: { ar: string; en: string };
    description: { ar: string; en: string };
    author: { ar: string; en: string };
    details: { ar: string; en: string };
    images: string[];
    quantity: number;
    priceAfterDiscount: number;
    price: number;
  }[];

  @Prop({
    type: Types.ObjectId,
    ref: Store.name,
  })
  store: Store;

  @Prop({
    type: Number,
    required: [true, 'total price is required'],
  })
  totalPrice: number;

  @Prop({
    type: Boolean,
    default: false,
  })
  isPaid: boolean;

  @Prop({
    type: String,
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;
}
