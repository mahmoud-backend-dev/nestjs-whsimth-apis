import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export enum Permissions {
  OWNER = 'owner',
  ADMIN = 'admin',
  MANAGE_HOME_SETTING = 'manage home setting',
  MANAGE_CATEGORY = 'manage category',
  MANAGE_STORE = 'manage store',
  MANAGE_ROLES = 'manage roles',
  MANAGE_USER = 'manage user',
  MANAGE_ORDER = 'manage order',
  MANAGE_PRODUCT = 'manage product',
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Role extends Document {

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: [String], enum: Permissions, required: true })
  permissions: Permissions[];

}

export const RoleSchema = SchemaFactory.createForClass(Role);