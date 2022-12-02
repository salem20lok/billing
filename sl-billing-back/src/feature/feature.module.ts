import { forwardRef, Module } from '@nestjs/common';
import { FeatureController } from './feature.controller';
import { FeatureService } from './feature.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Feature, FeatureSchema } from './schemas/feature.schema';
import { PermissionModule } from '../permission/permission.module';
import { UserPermissionModule } from '../user-permission/user-permission.module';
import { PlanFeatureModule } from '../plan-feature/plan-feature.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Feature.name, schema: FeatureSchema }]),
    forwardRef(() => PermissionModule),
    forwardRef(() => UserPermissionModule),
    PlanFeatureModule,
  ],
  controllers: [FeatureController],
  providers: [FeatureService],
})
export class FeatureModule {}
