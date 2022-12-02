import { forwardRef, Module } from '@nestjs/common';
import { TeamFeatureController } from './team-feature.controller';
import { TeamFeatureService } from './team-feature.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamFeature, TeamFeatureSchema } from './schemas/teamFeature.schema';
import { PermissionModule } from '../permission/permission.module';
import { UserPermissionModule } from '../user-permission/user-permission.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TeamFeature.name, schema: TeamFeatureSchema },
    ]),
    forwardRef(() => PermissionModule),
    forwardRef(() => UserPermissionModule),
  ],
  controllers: [TeamFeatureController],
  providers: [TeamFeatureService],
  exports: [TeamFeatureService],
})
export class TeamFeatureModule {}
