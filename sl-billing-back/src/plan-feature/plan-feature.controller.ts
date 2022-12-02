import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PlanFeatureService } from './plan-feature.service';
import { CreatePlanFeatureDto } from './dtos/create-planFeature.dto';
import { PlanFeatureDocument } from './schemas/featurePlan.schema';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionValidatorGuard } from '../guards/user-permission.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { RoleEnum } from '../@types/role.enum';
import { UpdatePlanFeatureDto } from './dtos/update-planFeature.dto';

@Controller('plan-feature')
@UseGuards(JwtAuthGuard, PermissionValidatorGuard, RolesGuard)
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
export class PlanFeatureController {
  constructor(private readonly planFeatureService: PlanFeatureService) {}

  @Post()
  async createPlanFeature(
    @Body() createDto: CreatePlanFeatureDto,
  ): Promise<PlanFeatureDocument> {
    return await this.planFeatureService.createPlanFeature(createDto);
  }

  @Get()
  async getAllPlanFeature(): Promise<PlanFeatureDocument[]> {
    return await this.planFeatureService.getAllPlanFeature();
  }

  @Get('plan/:id')
  async getPlanFeatureByPlan(
    @Param('id') id: string,
  ): Promise<PlanFeatureDocument[]> {
    return await this.planFeatureService.getPlanFeatureByPlan(id);
  }

  @Put(':id')
  async updatePlanFeature(
    @Param('id') id: string,
    @Body() updateDto: UpdatePlanFeatureDto,
  ): Promise<PlanFeatureDocument> {
    return await this.planFeatureService.updatePlanFeature(id, updateDto);
  }

  @Delete(':id')
  async deletePlanFeature(@Param('id') id: string): Promise<void> {
    return await this.planFeatureService.deletePlanFeature(id);
  }
}
