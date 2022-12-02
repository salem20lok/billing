import { forwardRef, Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from './schemas/team.schema';
import { PermissionModule } from '../permission/permission.module';
import { UserPermissionModule } from '../user-permission/user-permission.module';
import { TeamUserModule } from '../team-user/team-user.module';
import { UserModule } from '../user/user.module';
import { TeamFeatureModule } from '../team-feature/team-feature.module';
import { PlanFeatureModule } from '../plan-feature/plan-feature.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]),
    forwardRef(() => PermissionModule),
    forwardRef(() => UserPermissionModule),
    TeamUserModule,
    UserModule,
    TeamFeatureModule,
    PlanFeatureModule,
  ],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
