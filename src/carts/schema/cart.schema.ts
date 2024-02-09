import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NextFunction } from 'express-serve-static-core';
import { Document, Types } from 'mongoose';
import { Product } from 'src/products/schema/product.schema';
import { Store } from 'src/stores/schema/store.schema';
import { User } from 'src/users/schema/users.schema';

@Schema({
  timestamps: true,
  versionKey: true,
})
export class Cart extends Document {
  @Prop({
    type: [
      {
        _id: false,
        product: {
          type: Types.ObjectId,
          required: [true, 'product required'],
          ref: Product.name,
        },
        quantity: { type: Number, default: 1 },
      },
    ],
  })
  cartItems: {
    product: Product;
    quantity: number;
  }[];

  @Prop({
    type: Types.ObjectId,
    ref: Store.name,
  })
  store: Store;

  @Prop({
    type: Number,
    required: [true, 'totalPrice required'],
  })
  totalPrice: number;

  @Prop({
    type: Types.ObjectId,
    required: [true, 'user required'],
    ref: User.name,
  })
  user: User;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

