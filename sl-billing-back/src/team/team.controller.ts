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
import { TeamService } from './team.service';
import { CreateTeamDto } from './dtos/create-team.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { PermissionValidatorGuard } from '../guards/user-permission.guard';
import { Roles } from '../decorators/roles.decorator';
import { RoleEnum } from '../@types/role.enum';
import { PaginationTeamDto } from './dtos/pagination-team.dto';
import { TeamDocument } from './schemas/team.schema';
import { UpdateTeamDto } from './dtos/update-Team.dto';
import { IpValidatorGuard } from '../guards/IpValidatorGuard';

@Controller('team')
@UseGuards(JwtAuthGuard, PermissionValidatorGuard, RolesGuard)
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  async createTeam(@Body() teamDto: CreateTeamDto): Promise<TeamDocument> {
    return await this.teamService.createTeam(teamDto);
  }

  @Post('ip')
  @UseGuards(IpValidatorGuard)
  async createTeamWebhook(
    @Body() teamDto: CreateTeamDto,
  ): Promise<TeamDocument> {
    return await this.teamService.createTeam(teamDto);
  }

  @Get()
  async teamPagination(
    @Query() teamPagination: PaginationTeamDto,
  ): Promise<{ count: number; teams: TeamDocument[] }> {
    return await this.teamService.teamPagination(teamPagination);
  }

  @Get('all-teams')
  async getAllTeams(): Promise<TeamDocument[]> {
    return await this.teamService.getAllTeams();
  }

  @Get('plan/:id')
  async getAllTeamsByPlan(@Param('id') id: string): Promise<TeamDocument[]> {
    return await this.teamService.getAllTeamsByPlan(id);
  }

  @Get(':id')
  async getTeamById(@Param('id') id: string): Promise<TeamDocument> {
    return await this.teamService.getTeamById(id);
  }

  @Put(':id')
  async updateTeam(
    @Param('id') id: string,
    @Body() updateDto: UpdateTeamDto,
  ): Promise<TeamDocument> {
    return await this.teamService.updateTeam(id, updateDto);
  }

  @Delete(':id')
  async deleteTeam(@Param('id') id: string): Promise<void> {
    return await this.teamService.deleteTeam(id);
  }
}
