import { forwardRef, Module } from '@nestjs/common';
import { TeamUserController } from './team-user.controller';
import { TeamUserService } from './team-user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamUser, TeamUserSchema } from './schemas/teamUser.schema';
import { PermissionModule } from '../permission/permission.module';
import { UserPermissionModule } from '../user-permission/user-permission.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TeamUser.name, schema: TeamUserSchema },
    ]),
    forwardRef(() => PermissionModule),
    forwardRef(() => UserPermissionModule),
  ],
  controllers: [TeamUserController],
  providers: [TeamUserService],
  exports: [TeamUserService],
})
export class TeamUserModule {}
