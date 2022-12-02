import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserPermission,
  UserPermissionDocument,
} from './schemas/userPermission.schema';
import { Model } from 'mongoose';
import CreateUserPermissionDto from './dtos/create-user-permission.dto';
import { PaginationUserPermissionDto } from './dtos/pagination-user-permission.dto';
import { UpdateUserPermissionDto } from './dtos/update-user-permission.dto';

@Injectable()
export class UserPermissionService {
  constructor(
    @InjectModel(UserPermission.name)
    private userPermissionModel: Model<UserPermissionDocument>,
  ) {}

  async createUserPermission(
    userPermissionDto: CreateUserPermissionDto,
  ): Promise<UserPermissionDocument> {
    const { permission, user } = userPermissionDto;

    const found = await this.userPermissionModel.findOne({ user, permission });

    if (found)
      throw new ConflictException(
        `this permission :${permission} is exist for this user : ${user}`,
      );

    try {
      const res = new this.userPermissionModel(userPermissionDto);
      await res.save();
      return res;
    } catch (e) {
      if (found)
        throw new ConflictException(
          `this permission :${permission} is exist for this user : ${user}`,
        );
    }
  }

  async getUserPermissionPagination(
    paginationDto: PaginationUserPermissionDto,
  ): Promise<{
    count: number;
    userPermissions: UserPermission[];
  }> {
    const { skip, limit } = paginationDto;
    try {
      const userPermissions = await this.userPermissionModel
        .find({})
        .skip(skip)
        .limit(limit)
        .populate(['user', 'permission']);
      const count = await this.userPermissionModel.find({}).count();
      return { count, userPermissions };
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async getUserPermissionByUser(id: string): Promise<UserPermissionDocument[]> {
    try {
      return await this.userPermissionModel
        .find({ user: id })
        .populate(['user', 'permission']);
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async getUserPermissionByPermission(
    id: string,
  ): Promise<UserPermissionDocument[]> {
    try {
      return await this.userPermissionModel
        .find({ permission: id })
        .populate(['user', 'permission']);
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async updateUserPermission(
    id: string,
    updateDTo: UpdateUserPermissionDto,
  ): Promise<UserPermissionDocument> {
    const { user, permission } = updateDTo;
    const found = await this.userPermissionModel.findOne({ user, permission });
    if (found)
      throw new ConflictException(
        `this permission :${permission} is exist for this user : ${user}`,
      );

    const query = {
      user: user,
      permission: permission,
    };

    if (!permission) delete query.permission;
    if (!user) delete query.user;

    try {
      await this.userPermissionModel.findByIdAndUpdate(id, query);
      return await this.userPermissionModel
        .findById(id)
        .populate(['user', 'permission']);
    } catch (e) {
      if (found)
        throw new ConflictException(
          `this permission :${permission} is exist for this user : ${user}`,
        );
    }
  }

  async deletePermission(id: string): Promise<void> {
    try {
      await this.userPermissionModel.findByIdAndDelete(id);
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async deleteUserPermissionByUser(id: string): Promise<void> {
    try {
      const res = await this.userPermissionModel.find({ user: id });
      for (let i = 0; i < res.length; i++) {
        await this.userPermissionModel.findByIdAndDelete(res[i]._id);
      }
    } catch (e) {}
  }

  async controlledUserPermission(
    user,
    permission,
  ): Promise<UserPermissionDocument> {
    return await this.userPermissionModel.findOne({ user, permission });
  }

  async getPermissionByUserAndPermission(
    user: string,
    permission: string,
  ): Promise<UserPermissionDocument> {
    return await this.userPermissionModel.findOne({
      user: user,
      permission: permission,
    });
  }

  async bulkWriteInsertMany(permission: string[], user: string): Promise<void> {
    const bulk = permission.map((el) => {
      return {
        insertOne: { document: { user: user, permission: el } },
      };
    });
    await this.userPermissionModel.bulkWrite(bulk);
  }

  async bulkDeleteMany(permission: string[], user: string): Promise<void> {
    const bulk = permission.map((el) => {
      return {
        deleteMany: { filter: { user: user, permission: el } },
      };
    });
    await this.userPermissionModel.bulkWrite(bulk);
  }

  async bulkDeleteManyByUser(user: string): Promise<void> {
    await this.userPermissionModel.bulkWrite([
      {
        deleteMany: { filter: { user: user } },
      },
    ]);
  }
}
