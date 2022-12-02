import { forwardRef, Module } from '@nestjs/common';
import { PlanFeatureController } from './plan-feature.controller';
import { PlanFeatureService } from './plan-feature.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PlanFeature, PlanFeatureSchema } from './schemas/featurePlan.schema';
import { PermissionModule } from '../permission/permission.module';
import { UserPermissionModule } from '../user-permission/user-permission.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PlanFeature.name, schema: PlanFeatureSchema },
    ]),
    forwardRef(() => PermissionModule),
    forwardRef(() => UserPermissionModule),
  ],
  controllers: [PlanFeatureController],
  providers: [PlanFeatureService],
  exports: [PlanFeatureService],
})
export class PlanFeatureModule {}
