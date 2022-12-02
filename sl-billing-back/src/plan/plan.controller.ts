import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dtos/create-plan.dto';
import { PlanDocument } from './schemas/plan.schema';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionValidatorGuard } from '../guards/user-permission.guard';
import { PaginationPlanDto } from './dtos/pagination-plan.dto';
import { UpdatePlanDto } from './dtos/update-plan.dto';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { RoleEnum } from '../@types/role.enum';

@Controller('plan')
@UseGuards(JwtAuthGuard, PermissionValidatorGuard, RolesGuard)
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  async createPlan(@Body() planDto: CreatePlanDto): Promise<PlanDocument> {
    return await this.planService.createPlan(planDto);
  }

  @Get()
  async planPagination(
    @Query() paginationDto: PaginationPlanDto,
  ): Promise<{ count: number; plans: PlanDocument[] }> {
    return await this.planService.planPagination(paginationDto);
  }

  @Get('all-plan')
  async getAllPlan(): Promise<PlanDocument[]> {
    return await this.planService.getAllPlan();
  }

  @Put(':id')
  async updatePlan(
    @Param('id') id: string,
    @Body() planDto: UpdatePlanDto,
  ): Promise<PlanDocument> {
    return await this.planService.updatePlan(id, planDto);
  }

  @Get(':id')
  async getPlanById(@Param('id') id: string): Promise<PlanDocument> {
    return await this.planService.getPlanById(id);
  }

  @Delete(':id')
  async deletePlan(@Param('id') id: string): Promise<void> {
    return await this.planService.deletePlan(id);
  }
}
