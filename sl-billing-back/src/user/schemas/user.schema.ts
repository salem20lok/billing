import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RoleEnum } from '../../@types/role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true, index: true })
  firstName: string;

  @Prop({ type: String, required: true, index: true })
  lastName: string;

  @Prop({ type: String, required: true, index: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({
    type: String,
    required: true,
    default: RoleEnum.User,
    enum: RoleEnum,
  })
  role: string;

  @Prop({ type: String, required: false, default: null })
  avatar: string;

  @Prop({
    type: String,
    required: false,
  })
  forgetPasswordToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });
