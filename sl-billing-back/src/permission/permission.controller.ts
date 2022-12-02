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
import { PermissionService } from './permission.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { RoleEnum } from '../@types/role.enum';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { PermissionDocument } from './schemas/permission.schema';
import { UpdatePermissionDto } from './dtos/update-permission.dto';
import { PaginationPermissionDto } from './dtos/pagination-permission.dto';

@Controller('permission')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleEnum.SuperAdmin)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  async getPermissionPagination(
    @Query() permissionPagination: PaginationPermissionDto,
  ): Promise<{ count: number; Permissions: PermissionDocument[] }> {
    return await this.permissionService.getPermissionPagination(
      permissionPagination,
    );
  }

  @Get('all-permission')
  async getAllPermission(): Promise<PermissionDocument[]> {
    return await this.permissionService.getAllPermission();
  }

  @Get(':id')
  async getPermissionById(
    @Param('id') id: string,
  ): Promise<PermissionDocument> {
    return await this.permissionService.getPermissionById(id);
  }

  @Post()
  async createPermission(
    @Body() createPermission: CreatePermissionDto,
  ): Promise<PermissionDocument> {
    return await this.permissionService.createPermission(createPermission);
  }

  @Put(':id')
  async updatePermission(
    @Param('id') id: string,
    @Body() updatePermission: UpdatePermissionDto,
  ): Promise<PermissionDocument> {
    return await this.permissionService.updatePermission(id, updatePermission);
  }

  @Delete(':id')
  async deletePermission(@Param('id') id: string): Promise<void> {
    return await this.permissionService.deletePermission(id);
  }
}
