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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDocument } from './schemas/user.schema';
import { PaginationUserDto } from './dto/pagination-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { UserInterface } from './interface/user.interface';
import { UserPermissionDocument } from '../user-permission/schemas/userPermission.schema';
import { PermissionValidatorGuard } from '../guards/user-permission.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { RoleEnum } from '../@types/role.enum';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(PermissionValidatorGuard, RolesGuard)
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
  createUser(@Body() userDto: CreateUserDto): Promise<UserDocument> {
    return this.userService.createUser(userDto);
  }

  @Get()
  @UseGuards(PermissionValidatorGuard, RolesGuard)
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
  getAllUser(
    @Query() userPagination: PaginationUserDto,
  ): Promise<{ users: UserDocument[]; count: number }> {
    return this.userService.getAllUser(userPagination);
  }

  @Get('all-user')
  @UseGuards(PermissionValidatorGuard, RolesGuard)
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
  getUsers(): Promise<UserDocument[]> {
    return this.userService.getUsers();
  }

  @Get('identification')
  async identification(
    @GetUser() id: string,
  ): Promise<{ user: UserInterface; permission: UserPermissionDocument[] }> {
    return this.userService.identification(id);
  }

  @Get(':id')
  @UseGuards(PermissionValidatorGuard, RolesGuard)
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
  getUserById(@Param('id') id: string): Promise<UserDocument> {
    return this.userService.getUserById(id);
  }

  @Delete(':id')
  @UseGuards(PermissionValidatorGuard, RolesGuard)
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
  deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }

  @Put(':id')
  @UseGuards(PermissionValidatorGuard, RolesGuard)
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
  updateUser(
    @Param('id') id: string,
    @Body() updateUser: UpdateUserDto,
    @GetUser() consumer: string,
  ): Promise<UserDocument> {
    return this.userService.updateUser(id, updateUser, consumer);
  }
}
