import { Module } from '@nestjs/common';
import { UserPermissionController } from './user-permission.controller';
import { UserPermissionService } from './user-permission.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserPermission,
  UserPermissionSchema,
} from './schemas/userPermission.schema';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserPermission.name, schema: UserPermissionSchema },
    ]),
    PermissionModule,
  ],
  controllers: [UserPermissionController],
  providers: [UserPermissionService],
  exports: [UserPermissionService, MongooseModule],
})
export class UserPermissionModule {}
