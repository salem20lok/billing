import { forwardRef, Module } from '@nestjs/common';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Plan, PlanSchema } from './schemas/plan.schema';
import { PermissionModule } from '../permission/permission.module';
import { UserPermissionModule } from '../user-permission/user-permission.module';
import { TeamModule } from '../team/team.module';
import { PlanFeatureModule } from '../plan-feature/plan-feature.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Plan.name, schema: PlanSchema }]),
    forwardRef(() => PermissionModule),
    forwardRef(() => UserPermissionModule),
    TeamModule,
    PlanFeatureModule,
  ],
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlanModule {}
