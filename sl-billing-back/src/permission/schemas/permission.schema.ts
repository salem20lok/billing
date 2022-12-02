import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PermissionEnum } from '../../@types/permission.enum';
import { PermissionNameEnum } from '../../@types/permission-name.enum';

export type PermissionDocument = Permission & Document;

@Schema({ timestamps: true })
export class Permission {
  @Prop({ type: String, required: true, enum: PermissionEnum })
  management: string;

  @Prop({ type: String, required: true, enum: PermissionNameEnum })
  name: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
