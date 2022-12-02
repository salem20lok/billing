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
import { UserPermissionService } from './user-permission.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { RoleEnum } from '../@types/role.enum';
import CreateUserPermissionDto from './dtos/create-user-permission.dto';
import {
  UserPermission,
  UserPermissionDocument,
} from './schemas/userPermission.schema';
import { PaginationUserPermissionDto } from './dtos/pagination-user-permission.dto';
import { UpdateUserPermissionDto } from './dtos/update-user-permission.dto';
import { PermissionValidatorGuard } from '../guards/user-permission.guard';

@Controller('user-permission')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionValidatorGuard)
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
export class UserPermissionController {
  constructor(private readonly userPermissionService: UserPermissionService) {}

  @Get()
  async getUserPermissionPagination(
    @Query() paginationDto: PaginationUserPermissionDto,
  ): Promise<{
    count: number;
    userPermissions: UserPermission[];
  }> {
    return await this.userPermissionService.getUserPermissionPagination(
      paginationDto,
    );
  }

  @Get('user/:id')
  async getUserPermissionByUser(
    @Param('id') id: string,
  ): Promise<UserPermissionDocument[]> {
    return await this.userPermissionService.getUserPermissionByUser(id);
  }

  @Get('permission/:id')
  async getUserPermissionByPermission(
    @Param('id') id: string,
  ): Promise<UserPermissionDocument[]> {
    return await this.userPermissionService.getUserPermissionByPermission(id);
  }

  @Post()
  async createUserPermission(
    @Body() userPermissionDto: CreateUserPermissionDto,
  ): Promise<UserPermissionDocument> {
    return await this.userPermissionService.createUserPermission(
      userPermissionDto,
    );
  }

  @Put(':id')
  async updateUserPermission(
    @Param('id') id: string,
    @Body() updateUserPermissionDto: UpdateUserPermissionDto,
  ): Promise<UserPermissionDocument> {
    return await this.userPermissionService.updateUserPermission(
      id,
      updateUserPermissionDto,
    );
  }

  @Delete(':id')
  async deletePermission(@Param('id') id: string): Promise<void> {
    return await this.userPermissionService.deletePermission(id);
  }
}
