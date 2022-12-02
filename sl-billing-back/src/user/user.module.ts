import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserPermissionModule } from '../user-permission/user-permission.module';
import { MailModule } from '../mail/mail.module';
import { PermissionModule } from '../permission/permission.module';
import { TeamUserModule } from '../team-user/team-user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MailModule,
    TeamUserModule,
    forwardRef(() => PermissionModule),
    forwardRef(() => UserPermissionModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, MongooseModule],
})
export class UserModule {}
