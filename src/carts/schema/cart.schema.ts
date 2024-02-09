import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NextFunction } from 'express-serve-static-core';
import { Document, Types } from 'mongoose';

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
          ref: 'Product',
        },
        quantity: { type: Number, default: 1 },
      },
    ],
  })
  cartItems: {
    product: Types.ObjectId;
    quantity: number;
  }[];

  @Prop({
    type: Types.ObjectId,
    ref: 'Store',
  })
  store: Types.ObjectId;

  @Prop({
    type: Number,
    required: [true, 'totalPrice required'],
  })
  totalPrice: number;

  @Prop({
    type: Types.ObjectId,
    required: [true, 'user required'],
    ref: 'User',
  })
  user: Types.ObjectId;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

