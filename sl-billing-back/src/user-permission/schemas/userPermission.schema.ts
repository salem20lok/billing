import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { Permission } from '../../permission/schemas/permission.schema';

export type UserPermissionDocument = UserPermission & Document;

@Schema({ timestamps: true })
export class UserPermission {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
    index: true,
  })
  user: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Permission.name,
    required: true,
    index: true,
  })
  permission: string;
}

export const UserPermissionSchema =
  SchemaFactory.createForClass(UserPermission);
