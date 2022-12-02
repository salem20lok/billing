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
import { FeatureService } from './feature.service';
import { CreateFeatureDto } from './dtos/create-feature.dto';
import { FeatureDocument } from './schemas/feature.schema';
import { PermissionValidatorGuard } from '../guards/user-permission.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { RoleEnum } from '../@types/role.enum';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PaginationFeatureDto } from './dtos/pagination-feature.dto';
import { UpdateFeatureDto } from './dtos/update-feature.dto';

@Controller('feature')
@UseGuards(JwtAuthGuard, PermissionValidatorGuard, RolesGuard)
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Post()
  async createFeature(
    @Body() createDto: CreateFeatureDto,
  ): Promise<FeatureDocument> {
    return await this.featureService.createFeature(createDto);
  }

  @Get()
  async featurePagination(
    @Query() featurePagination: PaginationFeatureDto,
  ): Promise<{
    count: number;
    features: FeatureDocument[];
  }> {
    return await this.featureService.featurePagination(featurePagination);
  }

  @Get(':id')
  async getFeatureById(@Param('id') id: string): Promise<FeatureDocument> {
    return await this.featureService.getFeatureById(id);
  }

  @Put(':id')
  async updateFeature(
    @Param('id') id: string,
    @Body() updateDto: UpdateFeatureDto,
  ): Promise<FeatureDocument> {
    return await this.featureService.updateFeature(id, updateDto);
  }

  @Delete(':id')
  async deleteFeature(@Param('id') id: string): Promise<void> {
    return await this.featureService.deleteFeature(id);
  }
}
