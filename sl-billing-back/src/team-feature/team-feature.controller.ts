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
import { TeamFeatureService } from './team-feature.service';
import { CreateTeamFeatureDto } from './dtos/create-teamFeature.dto';
import { TeamFeatureDocument } from './schemas/teamFeature.schema';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionValidatorGuard } from '../guards/user-permission.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { RoleEnum } from '../@types/role.enum';
import { PaginationTeamFeatureDto } from './dtos/pagination-teamFeature.dto';
import { UpdateTeamFeatureDto } from './dtos/update-teamFeature.dto';

@Controller('team-feature')
@UseGuards(JwtAuthGuard, PermissionValidatorGuard, RolesGuard)
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
export class TeamFeatureController {
  constructor(private readonly teamFeatureService: TeamFeatureService) {}

  @Post()
  createTeamFeature(
    @Body() createDto: CreateTeamFeatureDto,
  ): Promise<TeamFeatureDocument> {
    return this.teamFeatureService.createTeamFeature(createDto);
  }

  @Get()
  teamFeaturePagination(
    @Query() paginationDto: PaginationTeamFeatureDto,
  ): Promise<{
    count: number;
    teamFeatures: TeamFeatureDocument[];
  }> {
    return this.teamFeatureService.teamFeaturePagination(paginationDto);
  }

  @Get('team/:id')
  getTeamFeaturesByTeam(
    @Param('id') id: string,
  ): Promise<TeamFeatureDocument[]> {
    return this.teamFeatureService.getTeamFeaturesByTeam(id);
  }

  @Put(':id')
  updateTeamFeature(
    @Param('id') id: string,
    @Body() updateTeamFeature: UpdateTeamFeatureDto,
  ): Promise<TeamFeatureDocument> {
    return this.teamFeatureService.updateTeamFeature(id, updateTeamFeature);
  }

  @Delete(':id')
  deleteTeamFeature(@Param('id') id: string): Promise<void> {
    return this.teamFeatureService.deleteTeamFeature(id);
  }
}
