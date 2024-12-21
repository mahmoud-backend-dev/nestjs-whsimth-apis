import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/roles/schema/role.schema';
@Schema()
export class AddressSchema {
  @Prop({ type: String })
  address: string;
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User extends Document {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true, minlength: 8 })
  password: string;

  @Prop({ type: Types.ObjectId, ref: Role.name, default: null })
  role: Role;

  @Prop({ type: Date })
  passwordChangedAt: Date;

  @Prop({ type: [AddressSchema], default: [] })
  addresses: AddressSchema[];

  @Prop({ type: Date })
  resetCodeExpiredForSignup: Date;

  @Prop({ type: Boolean, default: false })
  resetVerifyForSignup: boolean;

  @Prop({ type: Date })
  resetCodeExpiredForResetPassword: Date;

  @Prop({ type: Boolean, default: false })
  resetVerifyForResetPassword: boolean;

  @Prop({ type: Date })
  banExpired: Date;

  @Prop({ type: Boolean, default: false })
  isBanned: boolean;

  @Prop({ type: Boolean, default: false })
  banForever: boolean;

  createJWTForConfirmEmail(): string {
    const jwtService = new JwtService();
    return jwtService.sign(
      { userIdForSignup: 1, userId: this._id },
      { secret: process.env.JWT_SECRET, expiresIn: '1h' },
    );
  }

  createJWTForConfirmResetPassword(): string {
    const jwtService = new JwtService();
    return jwtService.sign(
      { userIdForResetPassword: 2, userId: this._id },
      { secret: process.env.JWT_SECRET, expiresIn: '1h' },
    );
  }

  createJWTForAuthorizedUser(): string {
    const jwtService = new JwtService();
    return jwtService.sign(
      { userId: this._id },
      { secret: process.env.JWT_SECRET, expiresIn: '30d' },
    );
  }

  async hashedPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.loadClass(User);
