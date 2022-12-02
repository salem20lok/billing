import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { Model } from 'mongoose';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { UpdatePermissionDto } from './dtos/update-permission.dto';
import { PaginationPermissionDto } from './dtos/pagination-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: Model<PermissionDocument>,
  ) {}

  async createPermission(
    createPermission: CreatePermissionDto,
  ): Promise<PermissionDocument> {
    const { name, management } = createPermission;

    const found = await this.permissionModel.findOne({
      name: name,
      management: management,
    });
    if (found)
      throw new ConflictException(
        `this permission name : ${name} is already exist`,
      );

    try {
      const res = new this.permissionModel(createPermission);
      await res.save();
      return res;
    } catch (e) {
      throw new ConflictException(
        `this permission name : ${name} is already exist`,
      );
    }
  }

  async updatePermission(
    id: string,
    updatePermission: UpdatePermissionDto,
  ): Promise<PermissionDocument> {
    const { name, management } = updatePermission;

    const found = await this.permissionModel.findOne({ name });
    if (found)
      throw new ConflictException(
        `this permission name : ${name} is already exist`,
      );

    const query = {
      name: name,
      management: management,
    };

    if (!name) delete query.name;
    if (!management) delete query.management;

    try {
      await this.permissionModel.findByIdAndUpdate(id, query);
      return await this.permissionModel.findById(id);
    } catch (e) {
      throw new ConflictException(
        `this permission name : ${name} is already exist`,
      );
    }
  }

  async getAllPermission(): Promise<PermissionDocument[]> {
    try {
      return await this.permissionModel.find({});
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async getPermissionPagination(
    permissionPagination: PaginationPermissionDto,
  ): Promise<{ count: number; Permissions: PermissionDocument[] }> {
    const { skip, limit } = permissionPagination;

    try {
      const Permissions = await this.permissionModel
        .find({})
        .skip(skip)
        .limit(limit);
      const count = await this.permissionModel.find({}).count();
      return { count, Permissions };
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async getPermissionById(id: string): Promise<PermissionDocument> {
    try {
      return await this.permissionModel.findById(id);
    } catch (e) {
      throw new NotFoundException(`this permission id:${id} not exist `);
    }
  }

  async deletePermission(id: string): Promise<void> {
    try {
      await this.permissionModel.findByIdAndDelete(id);
    } catch (e) {
      throw new NotFoundException(`this permission id:${id} not exist `);
    }
  }

  async getPermissionByNameAndManagement(
    name: string,
    management: string,
  ): Promise<PermissionDocument> {
    const query = {
      name: name,
      management: management,
    };
    return await this.permissionModel.findOne(query);
  }

  async getPermissionByManagement(
    management: string,
  ): Promise<PermissionDocument[]> {
    return await this.permissionModel.find({ management: management });
  }
}
