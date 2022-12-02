import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PaginationUserDto } from './dto/pagination-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserInterface } from './interface/user.interface';
import { UserPermissionService } from '../user-permission/user-permission.service';
import { MailService } from '../mail/mail.service';
import { UserPermissionDocument } from '../user-permission/schemas/userPermission.schema';
import { PermissionService } from '../permission/permission.service';
import { PermissionNameEnum } from '../@types/permission-name.enum';
import { RoleEnum } from '../@types/role.enum';
import { TeamUserService } from '../team-user/team-user.service';

// npx nestjs-command createSuperAdmin:email salemlokmani99@gmail.com --password  Salem-12  --firstName  salem  --lastName lokmani

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly userPermissionService: UserPermissionService,
    private readonly permissionService: PermissionService,
    private readonly teamUserService: TeamUserService,
    private readonly mailService: MailService,
  ) {}

  async createUser(userDto: CreateUserDto): Promise<UserDocument> {
    const { email, password, permission, confirmePassword, teams, avatar } =
      userDto;

    const found = await this.userModel.findOne({ email: email });

    if (found)
      throw new ConflictException(`this mail: ${email} is ealready exist `);

    if (password !== confirmePassword)
      throw new BadRequestException('please check correct confirmePassword');

    delete userDto.permission;
    delete userDto.confirmePassword;
    delete userDto.teams;

    try {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(password, salt);
      userDto.password = hash;
      const newUser = new this.userModel(userDto);
      await newUser.save().then(async (res) => {
        if (permission) {
          if (permission.length && res.role !== RoleEnum.SuperAdmin) {
            //email
            this.mailService.createBillingAccount(email, password);

            // create many userPermission
            await this.userPermissionService.bulkWriteInsertMany(
              permission,
              res._id,
            );
            // controlled permission view
            this.controlledPermissionView(permission, res._id);
          }
        }
        if (teams) {
          if (teams.length) {
            // create many userTeam
            await this.teamUserService.bulkWriteInsertManyTeamUserByUser(
              res._id,
              teams,
            );
          }
        }
      });
      return newUser;
    } catch (e) {
      throw new ConflictException(`this mail: ${email} is ealready exist `);
    }
  }

  async getAllUser(
    userPagination: PaginationUserDto,
  ): Promise<{ users: UserDocument[]; count: number }> {
    const { skip, limit, firstName } = userPagination;

    const query = {};

    if (firstName) {
      Object.assign(query, { $text: { $search: firstName } });
    }
    try {
      const users = await this.userModel.find(query).skip(skip).limit(limit);
      const count = await this.userModel.find(query).count();
      return { users: users, count: count };
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async getUserById(id: string): Promise<UserDocument> {
    try {
      const user = await this.userModel.findById(id);
      return user;
    } catch (e) {
      throw new NotFoundException(`this id : ${id} not exist`);
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.userModel.findByIdAndDelete(id).then(async (res) => {
        await this.userPermissionService.bulkDeleteManyByUser(id);
      });
    } catch (e) {
      throw new NotFoundException(`this id : ${id} not exist`);
    }
  }

  async updateUser(
    id: string,
    updateUser: UpdateUserDto,
    consumer: string,
  ): Promise<UserDocument> {
    const {
      password,
      email,
      role,
      lastName,
      firstName,
      avatar,
      permission,
      teams,
      permissionAdd,
      permissionDelete,
      teamsDelete,
      teamsAdd,
    } = updateUser;

    const found = await this.userModel.findById(id);
    if (!found) throw new NotFoundException(`this id : ${id} not exist `);

    const consumerUser = await this.userModel.findById(consumer);

    const query = {
      password: password,
      email: email,
      role: role,
      lastName: lastName,
      firstName: firstName,
      avatar: avatar,
    };

    if (!password) delete query.password;
    if (!email) delete query.email;
    if (!role) delete query.role;
    if (!lastName) delete query.lastName;
    if (!firstName) delete query.firstName;
    if (!avatar) delete query.avatar;

    try {
      await this.userModel.findByIdAndUpdate(id, query).then(async (res) => {
        if (consumerUser.role === RoleEnum.SuperAdmin) {
          if (permissionDelete) {
            if (permissionDelete.length) {
              await this.userPermissionService.bulkDeleteMany(
                permissionDelete,
                res._id,
              );
            }
          }

          if (permissionAdd) {
            if (permissionAdd.length) {
              // delete all permission
              // add new permission
              await this.userPermissionService.bulkWriteInsertMany(
                permissionAdd,
                res._id,
              );
            }
          }
          if (permission) {
            // controlled view
            this.controlledPermissionView(permission, res._id);
          }
        }

        if (teamsDelete) {
          if (teamsDelete.length) {
            // delete old team
            await this.teamUserService.bulkDeleteManyByUser(
              teamsDelete,
              res._id,
            );
          }
        }
        if (teamsAdd) {
          if (teamsAdd.length) {
            // create many userTeam
            await this.teamUserService.bulkWriteInsertManyTeamUserByUser(
              res._id,
              teamsAdd,
            );
          }
        }
      });
      return await this.userModel.findById(id);
    } catch (e) {
      throw new NotFoundException(`this id : ${id} not exist `);
    }
  }

  async getUserByEmail(email: string): Promise<UserDocument> {
    try {
      const found = await this.userModel.findOne({ email: email });
      return found;
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async changePassword(id: string, password: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, {
      password: password,
      forgetPasswordToken: null,
    });
  }

  async addSuperAdmin(user: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    confirmePassword: string;
  }): Promise<void> {
    const { password, lastName, firstName, email } = user;
    const query: CreateUserDto = {
      password: password,
      email: email,
      role: RoleEnum.SuperAdmin,
      firstName: firstName,
      lastName: lastName,
      confirmePassword: password,
      permission: [],
    };
    await this.createUser(query);
  }

  async addForgetPasswordToken(id: string, token: string): Promise<void> {
    try {
      await this.userModel.findByIdAndUpdate(id, {
        forgetPasswordToken: token,
      });
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async identification(
    id: string,
  ): Promise<{ user: UserInterface; permission: UserPermissionDocument[] }> {
    try {
      const res = await this.userPermissionService.getUserPermissionByUser(id);
      const found = await this.userModel.findById(id);
      if (!found) throw new UnauthorizedException();
      const query: UserInterface = {
        _id: found._id,
        email: found.email,
        role: found.role,
        lastName: found.lastName,
        firstName: found.firstName,
        avatar: found.avatar,
      };
      return { user: query, permission: res };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async controlledPermissionView(
    permission: string[],
    user: string,
  ): Promise<void> {
    for (let i = 0; i < permission.length; i++) {
      const resPermission = await this.permissionService.getPermissionById(
        permission[i],
      );

      const view =
        await this.permissionService.getPermissionByNameAndManagement(
          PermissionNameEnum.View,
          resPermission.management,
        );
      const result =
        await this.userPermissionService.getPermissionByUserAndPermission(
          user,
          view._id,
        );
      if (!result) {
        await this.userPermissionService.controlledUserPermission(
          user,
          view._id,
        );
      }
    }
  }

  async getUsers(): Promise<UserDocument[]> {
    try {
      return await this.userModel.find();
    } catch (e) {
      throw new BadRequestException();
    }
  }
}
