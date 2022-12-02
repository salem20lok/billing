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
import { TeamUserService } from './team-user.service';
import { CreateTeamUserDto } from './dtos/create-teamUser.dto';
import { TeamUserDocument } from './schemas/teamUser.schema';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { PermissionValidatorGuard } from '../guards/user-permission.guard';
import { Roles } from '../decorators/roles.decorator';
import { RoleEnum } from '../@types/role.enum';
import { PaginationTeamUserDto } from './dtos/pagination-teamUser.dto';
import { UpdateTeamUserDto } from './dtos/update-teamUser.dto';

@Controller('team-user')
@UseGuards(JwtAuthGuard, PermissionValidatorGuard, RolesGuard)
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
export class TeamUserController {
  constructor(private readonly teamUserService: TeamUserService) {}

  @Post()
  async createTeamUser(
    @Body() teamUserDto: CreateTeamUserDto,
  ): Promise<TeamUserDocument> {
    return await this.teamUserService.createTeamUser(teamUserDto);
  }

  @Get()
  async paginationTeamUser(
    @Query() teamUserPagination: PaginationTeamUserDto,
  ): Promise<{ count: number; teamUsers: TeamUserDocument[] }> {
    return await this.teamUserService.paginationTeamUser(teamUserPagination);
  }

  @Get('/user/:id')
  async getTeamUserByUser(
    @Param('id') id: string,
  ): Promise<TeamUserDocument[]> {
    return await this.teamUserService.getTeamUserByUser(id);
  }

  @Get('/team/:id')
  async getTeamUserByTeam(
    @Param('id') id: string,
  ): Promise<TeamUserDocument[]> {
    return await this.teamUserService.getTeamUserByTeam(id);
  }

  @Get(':id')
  async getTeamUserById(@Param('id') id: string): Promise<TeamUserDocument> {
    return await this.teamUserService.getTeamUserById(id);
  }

  @Put(':id')
  async updateTeamUser(
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamUserDto,
  ): Promise<TeamUserDocument> {
    return await this.teamUserService.updateTeamUser(id, updateTeamDto);
  }

  @Delete(':id')
  async deleteTeamUser(@Param('id') id: string): Promise<void> {
    return await this.teamUserService.deleteTeamUser(id);
  }
}
